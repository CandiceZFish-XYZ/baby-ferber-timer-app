#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { FerberTimerWebsiteStack } from "../lib/ferber-timer-website-stack";

const app = new cdk.App();
new FerberTimerWebsiteStack(app, "FerberTimerCdkStack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
