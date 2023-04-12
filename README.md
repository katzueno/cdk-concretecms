# Concrete CMS CDK scripts

This is base template to launch a simple EC2 instance for Concrete CMS & WordPress.

I consolidate all variables into config file so that you can easily set the necessary parameters.

It will deploy the following resources.

- Create 1 VPC
- Create 1 public subnet
- Create 1 security group
    - 80 port is fully open
    - 443 port is fully open
    - 22 port, set IP address to restrict
- Create 1 EC2 Instance inside of newly created VPC and public subnet
- Assign 1 Elastic IP to the EC2 instance
- Create an Route53's A record to specified subdomain.

## How to set-up for the 1st time

### Initial setup on your computer or workstation

These actions are only require to do once per device

- Install npm (Please search how to install if you don't know)
- [Install cdk](https://docs.aws.amazon.com/cdk/v2/guide/getting_started.html#getting_started_install)


It is also important to cleanup the code and update cdk packages afterwards.

### Initial setup on your AWS account

These actions are only require to do once per AWS account.

If you've never run CDK on your AWS account, you must run cdk bootsgrap command.

- Create a working directly on your local `mkdir cdk-sample`
- Create a hello world CDK project `npx cdk sample-app --language typescript`
- The initial CDK bootstrap `npx cdk bootstrap`
- Wait until it finished.
- You can delete `cdk-sample` directly and files after you've done the initial bootstrap for your account.

There is some resource created on your AWS account. If you decided that you no longer need CDK, you may want to delete those resources. Check `CDKToolkit` stack from your CloudFormation AWS Console.

## Making the Instance

### STEP 1: Clone this repo

Clone this repo to your directly.

### STEP 2. Prepare config parameters

in `/bin/config.ts`, I've put together variables to configure eaily.

Parameter | what it is
----|------
awsAccount | Enter your AWS account ID
awsRegion | Enter your desired region
stackName | This will be used as CloudFormation name and prefix of all resources except EC2
vpcName | This will be used as the part of VPC name `[stackName]/[vpcName]`
vpcCidrBlock | The CIDR block of VPC. (TO BE DEPRECATED)
vpcSubnetName | This will be used as the part of VPC name `[stackName]/[vpcSubnetName]`
securityGroupName | This will be used as the part of VPC name `[stackName]/[securityGroupName]`
sshAllowedIP | Which IP address to be accessed SSH from.
ec2InstanceName | This will be used as the part of EC Instance name `[stackName]/[ec2InstanceName]`
ec2AmiSsmParameter | This will fetch the latest AMI image ID of certain distribution such as Amazon Linux series. Make sure to use the right CPU types. Currently ARM version of Amaon Linux 2023 is selected
ec2OS | CURRENTLY NOT IN USE. You can set which Amazon Linux version to use.
cpuType | CURRENTLY NOT IN USE. You can set which CPU type 
instanceType | Set instance type to use. Take a good look at [InstanceClass](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ec2.InstanceClass.html) and [InstanceSize](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ec2.InstanceSize.html) documentation to chose the right instance.
keyPairName | Enter the name of keypair. You must upload or generate the keypair before running this CDK
ec2Tag1Key | Tag key to set for EC2 instance. Macareux Digital mainly use it to flag AWS Backups to backup the data.
ec2Tag1Value | Value of EC2 instance tag.
route53HostedZoneID | Obtain the hosted zone ID from Route53. You must create route53 zone beforehand
route53Domain | Enter the domain name of the hosted zone. You must create route53 zone beforehand
route53Subdomain | Enter the subdomain record to create. You must include the top level domain.
route53Ttl | Enter the TTL (time to live) value of domain record in minutes.

### STEP 3. Test

You can test by creating CloudFormation script.
Typescript and CDK helped you validate the script before deploying to certain extent.

```
cd [path/to/project]
cdk synth
```

## STEP 4. Deplouing new resources

To launch EC2,

```
cd [path/to/project]
cdk deploy
```

If you've set-up AWS credential using profile, add the following `--profile` option.

```
cd [path/to/project]
cdk deploy --profile [profile name]
```

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk deploy --profile SAMPLE` deploy this stack to your desired AWS account/region saved on your computer.
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template
