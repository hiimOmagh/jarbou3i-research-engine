# Security Policy

## Scope

Strategic Analysis Workbench is a static client-side browser tool. It does not include a backend service, database, authentication system, or server-side processing.

## Sensitive content warning

The tool generates prompts that users may paste into external AI assistants. Do not include confidential, personal, classified, legally sensitive, proprietary, or regulated information unless you understand the destination AI provider's privacy and retention policies.

## Reporting issues

Open a GitHub issue for:

- XSS or unsafe HTML rendering concerns
- privacy-sensitive behavior
- unexpected network requests
- export/download bugs
- broken Arabic/RTL rendering that could misrepresent analysis

## Expected network behavior

The deployed app is intended to run without backend calls. Any future external resource, analytics, or API dependency should be documented in the README and reviewed before release.
