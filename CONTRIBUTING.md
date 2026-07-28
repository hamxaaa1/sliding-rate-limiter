# Security Policy

Thank you for helping keep **Sliding Rate Limiter** secure.

This project is designed to protect applications from excessive requests by providing sliding window rate limiting with Memory and Redis storage support.

If you discover a security vulnerability, please report it responsibly.

---

# Supported Versions

Security updates are provided for the latest stable release.

| Version        | Supported |
| -------------- | --------- |
| Latest release | ✅ Yes     |
| Older versions | ❌ No      |

---

# Reporting a Vulnerability

Please do **not** create a public GitHub issue for security vulnerabilities.

Instead, report the issue privately.

Include:

* Description of the vulnerability
* Steps to reproduce
* Affected version
* Expected behavior
* Actual behavior
* Possible impact
* Suggested fix (if available)

You can report security issues through GitHub:

https://github.com/hamxaaa/sliding-rate-limiter/security

---

# What Counts as a Security Issue?

Examples:

* Rate limit bypass
* Incorrect request counting
* Redis storage vulnerabilities
* Memory store data leaks
* Improper handling of user identifiers
* Denial of service vulnerabilities
* Dependency vulnerabilities

---

# Response Timeline

After receiving a report:

1. We will acknowledge the report as soon as possible.
2. We will investigate and reproduce the issue.
3. A fix will be prepared if required.
4. A security release may be published.
5. Credit will be given to the reporter if they wish.

---

# Security Best Practices for Users

When using Sliding Rate Limiter:

## Use Unique Keys

Avoid using predictable shared keys.

Example:

```typescript
await limiter.consume(
  `user:${userId}`
);
```

Avoid:

```typescript
await limiter.consume(
  "global"
);
```

unless you intentionally want one global limit.

---

## Protect Redis

If using Redis storage:

* Enable authentication
* Restrict network access
* Use encrypted connections when needed
* Do not expose Redis publicly

---

## Keep Dependencies Updated

Regularly update dependencies:

```bash
npm update
```

Check vulnerabilities:

```bash
npm audit
```

---

# Responsible Disclosure

We appreciate security researchers and contributors who help improve this project.

Thank you for helping make Sliding Rate Limiter safer for everyone.
