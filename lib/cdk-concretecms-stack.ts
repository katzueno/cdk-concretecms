import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from "aws-cdk-lib/aws-iam"; // Allows working with IAM resources
import * as r53 from "aws-cdk-lib/aws-route53";
import * as r53targets from 'aws-cdk-lib/aws-route53-targets';
import * as path from "path"; // Helper for working with file paths
import { CONFIG } from '../bin/config';
export class CdkConcretecmsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
          
    // Create the VPC and public subnet
    const vpc = new ec2.Vpc(this, CONFIG.vpcName, {
      cidr: CONFIG.vpcCidrBlock,
      maxAzs: 1,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: CONFIG.vpcSubnetName,
          subnetType: ec2.SubnetType.PUBLIC,
        },
      ],
    });

    // Security group for the EC2 instance
    const securityGroup = new ec2.SecurityGroup(this, "SecurityGroup", {
      vpc,
      description: "Allow SSH (TCP port 22) and HTTP (TCP port 80) in",
      allowAllOutbound: true,
    });
    securityGroup.addIngressRule(ec2.Peer.ipv4(CONFIG.sshAllowedIP), ec2.Port.tcp(22), 'Allow SSH access');
    securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(80), 'Allow HTTP traffic');
    securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(443), 'Allow HTTPS traffic');

    // IAM role to allow access to other AWS services
    const role = new iam.Role(this, "ec2Role", {
      assumedBy: new iam.ServicePrincipal("ec2.amazonaws.com"),
    });

    // IAM policy attachment to allow access to 
    role.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonSSMManagedInstanceCore")
    );

    // Look up the AMI Id for the Amazon Linux 2 Image with CPU Type X86_64
    /*
    const ami = new ec2.AmazonLinuxImage({
      generation: CONFIG.ec2OS,
      cpuType: CONFIG.cpuType,
    });
    */

    const machineImage = ec2.MachineImage.fromSsmParameter(
      CONFIG.ec2AmiSsmParameter,
    )

    // Create the EC2 instance using the Security Group, AMI, and KeyPair defined.
    const ec2Instance = new ec2.Instance(this, CONFIG.ec2InstanceName, {
      vpc,
      instanceType: CONFIG.instanceType,
      //machineImage: ami,
      machineImage: machineImage,
      securityGroup: securityGroup,
      keyName: CONFIG.keyPairName,
      role: role,
    });

    // Assign ElasticIP
    const elasticIp = new ec2.CfnEIP(this, 'EIP', {
      instanceId: ec2Instance.instanceId,
    });

    // Import an existing hosted zone
    const hostedZoneId = CONFIG.route53HostedZoneID;
    const hostedZone = r53.HostedZone.fromHostedZoneAttributes(this, 'HostedZone', {
      hostedZoneId,
      zoneName: CONFIG.route53Domain,
    });

    // Create a Route53 A record
    new r53.ARecord(this, 'ARecord', {
      zone: hostedZone,
      recordName: CONFIG.route53Subdomain,
      target: r53.RecordTarget.fromIpAddresses(elasticIp.ref),
      ttl: cdk.Duration.minutes(CONFIG.route53Ttl),
    });
  }
}
