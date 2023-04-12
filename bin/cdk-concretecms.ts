#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CdkConcretecmsStack } from '../lib/cdk-concretecms-stack';
import { CONFIG } from '../bin/config';

const app = new cdk.App();

cdk.Tags.of(app).add(CONFIG.ec2Tag1Key, CONFIG.ec2Tag1Value, {
  includeResourceTypes: ['AWS::EC2::Instance'],
});

new CdkConcretecmsStack(app, CONFIG.stackName, {
  env: {account: CONFIG.awsAccount, region: CONFIG.awsRegion},
});
