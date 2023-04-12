import * as ec2 from 'aws-cdk-lib/aws-ec2';

export const CONFIG = {

    // **********
    // # Your AWS account number and region
    "awsAccount" : "123456789012",
    "awsRegion" : "ap-northeast-1",

    // **********
    // # CloudFormation Stack name
    "stackName": 'develop-example-com',
    "stackDescription": 'Simple CDK to make a VPC and launch an EC2 instance with Amazon Linux 2023',

    // **********
    // # VPC, Subnet and Security Gateway
    "vpcName": "vpc",
    "vpcCidrBlock": "10.0.0.0/16",
    "vpcSubnetName": "sbn",
    "securityGroupName" : "sg",
    "sshAllowedIP" : "192.168.1.1/32",

    // **********
    // # EC2 Instance Parameters
    "ec2InstanceName" : "example.com"
    // ## Get AMI Image ID via SSM parameter directly 
    // For Amazon Linux 2023, See https://docs.aws.amazon.com/linux/al2023/ug/get-started.html
    // - Intel Processor
    // "ec2AmiSsmParameter" : "/aws/service/ami-amazon-linux-latest/al2023-ami-kernel-default-x86_64",
    // - ARM and graviton
    "ec2AmiSsmParameter" : "/aws/service/ami-amazon-linux-latest/al2023-ami-kernel-default-arm64",
    // ## Get AMI Image ID via CDK. (Amazon Linux 2023 is not yet supported as of April 2023)
    // See https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ec2.AmazonLinuxGeneration.html
    // "ec2OS" : ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
    // "ec2OS" : ec2.AmazonLinuxGeneration.AMAZON_LINUX_2023,
    // https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ec2.AmazonLinuxCpuType.html
    // "cpuType" : ec2.AmazonLinuxCpuType.ARM_64,
    // "cpuType" : ec2.AmazonLinuxCpuType.X86_64,
    // ## Instance Type
    // https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ec2.InstanceType.html
    // https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ec2.InstanceClass.html
    // https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ec2.InstanceSize.html
    "instanceType" : ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE4_GRAVITON, ec2.InstanceSize.MICRO),
    // ## Keypair Name (please create and enter before running CDK)
    "keyPairName" : "keyName",
    // ## Tag: Macareux Digital's Backupplan
    "ec2Tag1Key" : "Backups",
    "ec2Tag1Value" : "7-daily-plan",

    // **********
    // Route53 Record Setup
    "route53HostedZoneID" : "XXXXXXXX",
    "route53Domain" : "example.com",
    "route53Subdomain" : "sub.example.com",
    // TTL in minutes
    "route53Ttl" : 5,
}