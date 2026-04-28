# DocuPotion n8n Workflow Templates

Pre-built n8n workflows that use the [DocuPotion community node](https://github.com/docupotion/n8n-nodes-docupotion).

| Template | What it does | n8n.io |
|---|---|---|
| [Invoice from Google Sheets](./invoice-from-google-sheets.json) | Generate a PDF invoice when a row's status flips to `Active` in Google Sheets, upload it to Drive, and write the PDF link back to the sheet. | [n8n.io/workflows/15259](https://n8n.io/workflows/15259-generate-invoice-pdfs-from-google-sheets-with-docupotion-and-drive/) |

## How to use

1. Click a template name above, then click **Raw** in GitHub and save the file.
2. In n8n: **Workflows → Import from File**.
3. Connect the credentials each template needs (Google Sheets, Google Drive, DocuPotion, etc.) and replace any placeholder IDs. Each workflow has setup notes pinned as sticky notes inside it.

## Requirements

All templates require the `n8n-nodes-docupotion` community node. Install via **Settings → Community Nodes → Install** and enter `n8n-nodes-docupotion`.
