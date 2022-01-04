import * as cdk from "@aws-cdk/core";
import * as s3 from "@aws-cdk/aws-s3";
import * as iam from "@aws-cdk/aws-iam";

export class InfrastructureCdkStack extends cdk.Stack {
	constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
		super(scope, id, props);

		const idVerificationImages = new s3.Bucket(
			this,
			`mudd-id-verification-images`,
			{
				versioned: true,
				publicReadAccess: false,
				bucketName: "mudd-id-verification-images",
				blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
				accessControl: s3.BucketAccessControl.PRIVATE,
			}
		);

		const verificationBucketManagerPolicy = new iam.PolicyDocument({
			statements: [
				new iam.PolicyStatement({
					actions: ["s3:PutObject", "s3:GetObject"],
					resources: [idVerificationImages.bucketArn],
				}),
			],
		});

		const verificationBucketManagerRole = new iam.Role(
			this,
			"verification-bucket-manager-role",
			{
				assumedBy: new iam.AccountPrincipal("061155101849"),
			}
		);
	}
}
