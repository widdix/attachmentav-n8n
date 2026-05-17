![Banner image](https://user-images.githubusercontent.com/10284570/173569848-c624317f-42b1-45a6-ab09-f0ea3c247648.png)

# @attachmentav/n8n-nodes-attachmentav

This is an n8n community node. It lets interact with official API of [attachmentAV](https://attachmentav.com/)

This package contains nodes to scan a file or URL for malware and viruses.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

- [Installation](#installation)
- [Credentials](#credentials)
- [Usage](#usage)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

The npm package name is [@attachmentav/n8n-nodes-attachmentav](https://www.npmjs.com/package/@attachmentav/n8n-nodes-attachmentav).

## Credentials

This n8n community node requires an attachmentAV subscription and API key: [Get API key](https://attachmentav.com/subscribe/n8n/).

## Usage

### "Scan a File" node

- Add the AttachmentAV node to your workflow
- Configure your attachmentAV API credentials
- Set Resource to "Scan" and Operation to "Scan a File"
- Connect a node that provides binary data (e.g. a file download node) to the AttachmentAV node
- Execute the workflow to scan the file for viruses and malware

### "Scan a URL" node

- Add the AttachmentAV node to your workflow
- Configure your attachmentAV API credentials
- Set Resource to "Scan" and Operation to "Scan a URL"
- Enter the URL of the file you want to scan
- Execute the workflow to scan the URL target for viruses and malware
