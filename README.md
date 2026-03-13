# n8n-nodes-docupotion

This is an n8n community node. It lets you use DocuPotion in your n8n workflows.

[DocuPotion](https://docupotion.com/) is a document generation and automation tool. It lets you design professional-looking document templates using a drag and drop editor. You can generate PDFs of these templates and fill them with your own data in an n8n workflow.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/sustainable-use-license/) workflow automation platform.

[Installation](#installation)
[Operations](#operations)
[Credentials](#credentials)
[Compatibility](#compatibility)
[Usage](#usage)
[Resources](#resources)
[Version history](#version-history)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

| Operation | Description |
|-----------|-------------|
| Create Document | Generate a PDF document from a DocuPotion template |

### Output options

| Option | Description |
|--------|-------------|
| File | Returns the document as binary data for use in subsequent workflow steps (e.g. email attachments, cloud storage uploads) |
| URL | Returns a temporary presigned URL to the generated document |
| Base64 | Returns the document as a base64-encoded string |

## Credentials

To use this node, you need a DocuPotion account:

1. Sign up at [app.docupotion.com](https://app.docupotion.com/register)
2. Copy your API Key from the dashboard
3. In n8n, add a new **DocuPotion API** credential and paste your API Key

## Compatibility

Tested with n8n v1.71.0 and above.

## Usage

1. Add the **DocuPotion** node to your workflow
2. Select your DocuPotion API credentials
3. Enter the **Template ID** of the template you want to generate
4. Choose an **Output** type:
   - **File** (default) — returns binary data you can pass to nodes like Send Email, Google Drive, Write Binary File, etc. You can set a custom file name.
   - **URL** — returns a temporary link to the document. You can configure how long the URL remains valid (1–10,080 minutes).
   - **Base64** — returns the raw base64-encoded document data in the JSON output.
5. Optionally provide **Template Data** as a JSON object to fill in dynamic template variables

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
* [n8n + DocuPotion quickstart guide](https://docs.docupotion.com/article/67-n8n-quickstart-creating-a-document-in-a-workflow)
* [DocuPotion API docs](https://docupotion.com/api-docs)
* [DocuPotion knowledge base](https://docs.docupotion.com/)

## Version history

### 0.1.0

Initial release with the following features:

- **Create Document** operation — generate PDFs from DocuPotion templates
- **Output options** — File (binary), URL (presigned), or Base64
- **Template Data** — pass dynamic variables as JSON to populate templates
