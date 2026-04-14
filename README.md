# CGIAR Demand Intelligence Platform (DIP)

Transforming fragmented demand signals into actionable scaling intelligence.

## Overview

The Demand Intelligence Platform is CGIAR's analytical engine for identifying where, what, and how agricultural innovations can be scaled to achieve maximum impact. It synthesizes data from multiple sources through a structured **7 > 5 > 1** framework.

### The Framework

**7 Data Signal Domains** feed into **5 Demand Signaling Dimensions**, which converge into **1 Scaling Opportunity** output.

**Data Signal Domains:**

| # | Domain | Guiding Question |
|---|--------|-----------------|
| 1 | Scaling Context | What conditions shape how innovations can be taken to scale? |
| 2 | Sector | What sector-specific dynamics shape demand for agricultural innovation? |
| 3 | Stakeholders | Who are the key actors and what are their needs? |
| 4 | Enabling Environment | What conditions enable or constrain innovation scaling? |
| 5 | Resource & Investment | What resources are available and where are funding gaps? |
| 6 | Market Intelligence | What are the market dynamics and commercial pathways? |
| 7 | Innovation Portfolio | What innovations exist and how well do they match demand? |

**Demand Signaling Dimensions:**

1. **Geography & Priority** -- Where should CGIAR focus?
2. **Demand Signals** -- What do countries, funders, and partners need?
3. **Innovation Supply** -- What innovations are available?
4. **Demand Gaps** -- Where does demand exceed supply?
5. **Investment Feasibility** -- What is realistic to pursue?

These five dimensions converge into **Scaling Opportunity** -- identifying effective demand where innovations can be scaled with the highest impact and feasibility.

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4
- **Routing:** React Router v7
- **Backend (planned):** AWS Lambda, API Gateway, DynamoDB
- **Infrastructure:** AWS S3, CloudFront, Cognito, CloudWatch, EventBridge
- **CI/CD:** GitHub Actions
- **IaC:** AWS CloudFormation

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

## Deployment Architecture

```
GitHub Actions --> S3 (static assets) --> CloudFront (CDN) --> Users
                                             |
                                         API Gateway --> Lambda --> DynamoDB
                                             |
                                          Cognito (auth)
```

The CloudFormation template in `infrastructure/cloudformation/template.yaml` provisions the S3 bucket, CloudFront distribution, and optional Route53 DNS record.

## Project Structure

```
src/
  components/
    layout/         # Header, Sidebar, Footer
    common/         # Reusable UI components (Card, Badge, LoadingSpinner)
    domains/        # 7 domain-specific components
  pages/            # Route-level page components
  hooks/            # Custom React hooks
  services/         # API client and auth service
  types/            # TypeScript type definitions
  utils/            # Helper functions
infrastructure/
  cloudformation/   # AWS CloudFormation templates
.github/
  workflows/        # GitHub Actions CI/CD pipelines
```

## Contributing

Contributions are welcome. Please open an issue first to discuss proposed changes.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

TBD
