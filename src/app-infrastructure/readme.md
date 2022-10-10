# Infrastructure

Uses default AWS credential chain.

Inspects the contextual account's resources and deploys/corrects necessary components.

The overall system is:

- React UI app in Cloudfront/S3
- API Gateway proxied to Lambda
- Data ingested and mapped from external APIs or created by the 
application are stored in DynamoDB