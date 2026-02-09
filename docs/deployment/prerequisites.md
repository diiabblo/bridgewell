# Prerequisites

## System Requirements

### Hardware Requirements

- **CPU**: Minimum 2 cores, recommended 4+ cores
- **RAM**: Minimum 4GB, recommended 8GB+
- **Storage**: Minimum 20GB free space
- **Network**: Stable internet connection with minimum 10 Mbps

### Software Requirements

#### Required Software

1. **Node.js** (v18.0.0 or higher)
   ```bash
   # Check Node.js version
   node --version
   
   # Install Node.js using nvm
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   nvm install 18
   nvm use 18
   ```

2. **Clarinet** (v2.0.0 or higher)
   ```bash
   # Install Clarinet
   curl -L https://www.hiro.so/clarinet/install | bash
   
   # Verify installation
   clarinet --version
   ```

3. **Git**
   ```bash
   # Check Git version
   git --version
   
   # Install on Ubuntu/Debian
   sudo apt-get update
   sudo apt-get install git
   
   # Install on macOS
   brew install git
   ```

4. **Docker** (for running local services)
   ```bash
   # Install Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   
   # Verify installation
   docker --version
   docker-compose --version
   ```

#### Optional Software

1. **Stacks CLI**
   ```bash
   npm install -g @stacks/cli
   ```

2. **PostgreSQL** (if not using Docker)
   ```bash
   # Ubuntu/Debian
   sudo apt-get install postgresql postgresql-contrib
   
   # macOS
   brew install postgresql
   ```

## Wallet Setup

### Stacks Wallet

You'll need a Stacks wallet for deploying contracts and testing:

1. **Leather Wallet** (Recommended)
   - Install from [leather.io](https://leather.io)
   - Create a new wallet or import existing
   - Switch to Testnet for testing
   - Save your secret key securely

2. **Xverse Wallet** (Alternative)
   - Install from [xverse.app](https://xverse.app)
   - Create a new wallet
   - Enable testnet mode in settings

### Get Testnet Tokens

1. **Testnet STX**
   - Visit [Stacks Faucet](https://explorer.stacks.co/sandbox/faucet?chain=testnet)
   - Enter your testnet address
   - Request tokens (you'll receive ~500 STX)

2. **Testnet Bitcoin** (for testing)
   - Visit [Bitcoin Testnet Faucet](https://testnet-faucet.mempool.co/)
   - Enter your Bitcoin testnet address

## API Keys and Services

### Required API Keys

1. **Hiro API Key** (Optional but recommended for production)
   ```bash
   # Sign up at platform.hiro.so
   # Generate API key
   # Add to .env file
   HIRO_API_KEY=your_api_key_here
   ```

2. **IPFS/Pinata** (for metadata storage)
   ```bash
   # Sign up at pinata.cloud
   # Generate API keys
   PINATA_API_KEY=your_api_key
   PINATA_SECRET_KEY=your_secret_key
   ```

### Network Configuration

Ensure the following ports are available:

- **3000**: Frontend development server
- **3999**: Stacks blockchain API
- **20443**: Stacks blockchain RPC
- **5432**: PostgreSQL (if running locally)
- **6379**: Redis (if running locally)

### Firewall Configuration

```bash
# Allow necessary ports (Ubuntu/Debian)
sudo ufw allow 3000/tcp
sudo ufw allow 3999/tcp
sudo ufw allow 20443/tcp
```

## Development Tools

### Code Editor

Recommended: **Visual Studio Code** with extensions:
- Clarity Language Server
- ESLint
- Prettier
- GitLens

```bash
# Install VS Code extensions
code --install-extension hirosystems.clarity-lsp
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension eamodio.gitlens
```

## Verification

Run this verification script to check all prerequisites:

```bash
#!/bin/bash

echo "Checking prerequisites..."

# Check Node.js
if command -v node &> /dev/null; then
    echo "✓ Node.js $(node --version)"
else
    echo "✗ Node.js not found"
fi

# Check Clarinet
if command -v clarinet &> /dev/null; then
    echo "✓ Clarinet $(clarinet --version)"
else
    echo "✗ Clarinet not found"
fi

# Check Git
if command -v git &> /dev/null; then
    echo "✓ Git $(git --version)"
else
    echo "✗ Git not found"
fi

# Check Docker
if command -v docker &> /dev/null; then
    echo "✓ Docker $(docker --version)"
else
    echo "✗ Docker not found"
fi

echo "Prerequisite check complete!"
```

## Next Steps

Once all prerequisites are installed, proceed to [Environment Setup](./environment-setup.md).
