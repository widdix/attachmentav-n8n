![Banner image](https://user-images.githubusercontent.com/10284570/173569848-c624317f-42b1-45a6-ab09-f0ea3c247648.png)

# @widdix/attachmentav-n8n

This is an n8n community node. It lets interact with official API of [AttachmentAV](https://attachmentav.com/)

This package contains nodes to scan a file oder url for Male / Viruses.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

- [Installation](#installation)
- [Credentials](#credentials)
- [Usage](#usage)
- [Resources](#resources)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

Use the package at [here](https://www.npmjs.com/package/@widdix/attachment-n8n).

## Credentials

Add your Api Key and store securely


## Usage

### "Scan A File" node

- Add the HTML to PDF node to your workflow
- Configure your AttachmentAV API credentials
- Input your HTML content
- Execute the workflow to generate PDF

### "Scan A Url" node

- Add the Merge PDFs node to your workflow
- Configure your AttachmentAV API credentials
- Input PDF files as an array with the same field name to merge.
- If total size of files exceeds 6MB, pass it as an array of URL seperated by comma.
- Execute the workflow to get merged PDF file.