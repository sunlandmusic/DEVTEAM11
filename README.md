# DEV TEAM AI Orchestration System

A sophisticated AI orchestration platform that coordinates multiple AI models to work together as specialized teams, providing comprehensive solutions for document processing, analysis, and AI model development.

## Features

- **Multi-Team AI Processing**: Coordinate 4 specialized AI teams with different capabilities
- **File Attachment Support**: Upload and process documents with AI analysis
- **Task Queue System**: Queue multiple tasks for batch processing
- **Three Processing Modes**: Economy, Pro, and Premium with different model combinations
- **Real-time Processing**: Live status updates and response streaming
- **Export & Sharing**: Copy, export, and share AI responses

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd dev-team-ai-orchestration-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   VITE_OPENROUTER_API_KEY=your_openrouter_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## Environment Variables

- `VITE_OPENROUTER_API_KEY`: Your OpenRouter API key for AI model access

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your environment variables in Vercel dashboard
4. Deploy automatically on push

### Manual Deployment

1. Build the project: `npm run build`
2. Deploy the `dist` folder to your hosting provider

## Usage

1. **Select Processing Mode**: Choose between Economy, Pro, or Premium
2. **Upload Files**: Use the attachment button to upload documents
3. **Choose Prompt**: Select from predefined prompts or type custom ones
4. **Select Teams**: Choose which AI teams to process your request
5. **Start Processing**: Click the start button to begin AI analysis
6. **Review Results**: View, copy, or export the AI responses

## Architecture

- **Frontend**: React + TypeScript + Vite
- **State Management**: Zustand
- **Styling**: Styled Components
- **AI Integration**: OpenRouter API
- **File Processing**: Client-side file reading and processing

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

Private - All rights reserved
