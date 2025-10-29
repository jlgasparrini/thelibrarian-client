# GitHub Actions CI/CD

## CI Workflow

The CI workflow (`.github/workflows/ci.yml`) runs on:
- Every push to `main` branch
- Every pull request targeting `main` branch

### Jobs

#### 1. **Lint** 
- Runs ESLint to check code quality
- Runs TypeScript type checking
- Ensures code follows project standards

#### 2. **Test**
- Runs all Vitest tests
- Ensures all tests pass before merge

#### 3. **Build**
- Builds the production bundle
- Verifies the project can be built successfully

### Node.js Version

All jobs use Node.js 24.11.0 (from `.node-version` file) with npm caching for faster builds.

### Status Badge

Add this badge to your README.md to show CI status:

```markdown
[![CI](https://github.com/jlgasparrini/thelibrarian-client/actions/workflows/ci.yml/badge.svg)](https://github.com/jlgasparrini/thelibrarian-client/actions/workflows/ci.yml)
```

## Future Enhancements

- [ ] Add test coverage reporting
- [ ] Add deployment to Vercel on merge to main
- [ ] Add dependency security scanning
- [ ] Add code quality checks (SonarCloud, CodeClimate)
