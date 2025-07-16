# DEV TEAM Platform Overview

## What is DEV TEAM?

DEV TEAM is an AI-powered development platform that leverages multiple AI models simultaneously to accelerate project development and task execution. The platform consists of three main components that work together to provide a comprehensive development workflow.

## Core Components

### 1. PREPARATION Page
**Purpose**: Project planning and task preparation

**Features**:
- **AI Model Options**: 
  - Economy: DEEPSEEK R1
  - Premium: GROK 4
- **Key Functions**:
  - Generate project overviews
  - Create Product Requirements Documents (PRDs)
  - Develop comprehensive task lists with detailed requests
  - File attachment support (up to 1MB)
  - Built-in prompt templates for common development tasks

**Use Case**: When starting a new project, use PREPARATION to create structured documentation and task breakdowns.

### 2. DEV TEAM Page
**Purpose**: Multi-AI parallel task execution

**Features**:
- **AI Model Options**:
  - Economy: DEEPSEEK R1 (x4 models simultaneously)
  - PRO: Claude Opus 4 (x4 models simultaneously)
  - Premium: GEMINI 2.5 PRO + CLAUDE OPUS 4 + GROK 4 + DEEPSEEK R1 (x4 models simultaneously)
- **Key Functions**:
  - Select 1-4 AI teams for parallel processing
  - Task mode for queued task execution
  - Real-time processing status with visual feedback
  - Individual team response management
  - File attachment support
  - Copy/export individual team responses

**Use Case**: Execute multiple development tasks in parallel using different AI models for comprehensive coverage and faster results.

### 3. CLEANER Page
**Purpose**: AI-powered data cleaning and formatting

**Features**:
- **AI Model Options**:
  - Economy: DEEPSEEK R1
  - Premium: GROK 4
- **Key Functions**:
  - Remove duplicate data
  - Summarize and clean datasets
  - Format and label data
  - Compile scattered information
  - File attachment support for data processing

**Use Case**: Clean, organize, and format raw data, code outputs, or documentation for better usability.

## How It Works

### Workflow
1. **Start with PREPARATION**: Create project overview, PRD, and task list
2. **Execute with DEV TEAM**: Use multiple AI models to work on tasks simultaneously
3. **Refine with CLEANER**: Clean and format the results for final use

### AI Model Selection
- **Economy**: Cost-effective models for basic tasks
- **PRO**: High-performance Claude Opus 4 for complex reasoning
- **Premium**: Multiple top-tier models for maximum capability

### Parallel Processing
The DEV TEAM page can run up to 4 AI models simultaneously, each working on the same task or different tasks in a queue. This provides:
- Faster completion times
- Multiple perspectives on complex problems
- Redundancy and validation
- Comprehensive coverage of different approaches

## Key Features

### File Management
- Support for text file attachments (up to 1MB)
- File status tracking (success/error)
- Content extraction and processing

### Task Management
- Queue multiple tasks for sequential processing
- Real-time progress tracking
- Individual task editing and removal

### Response Management
- Copy individual team responses
- Export responses as text files
- Clear all responses
- Visual processing indicators

### User Interface
- Clean, modern dark theme
- Responsive design
- Real-time status updates
- Intuitive navigation between pages

## Use Cases

### Software Development
1. **PREPARATION**: Create project specifications and task breakdowns
2. **DEV TEAM**: Generate code, debug issues, and implement features using multiple AI models
3. **CLEANER**: Format code outputs and clean generated documentation

### Content Creation
1. **PREPARATION**: Plan content structure and requirements
2. **DEV TEAM**: Generate content using different AI perspectives
3. **CLEANER**: Format and organize the final content

### Data Analysis
1. **PREPARATION**: Define analysis requirements
2. **DEV TEAM**: Perform analysis using multiple AI models
3. **CLEANER**: Clean and format the analysis results

## Technical Architecture

- **Frontend**: React with TypeScript
- **Styling**: Styled Components
- **AI Integration**: OpenRouter API
- **State Management**: Custom store with Zustand
- **File Handling**: Browser-based file processing

## Benefits

1. **Speed**: Parallel AI processing reduces completion time
2. **Quality**: Multiple AI perspectives improve output quality
3. **Flexibility**: Three specialized pages for different needs
4. **Cost-Effective**: Economy options for budget-conscious users
5. **Scalable**: Can handle multiple tasks and teams simultaneously

## Getting Started

1. Choose the appropriate page for your task
2. Select your preferred AI model tier
3. Enter your prompt or task description
4. Attach any relevant files
5. Execute and review results
6. Use the copy/export features to save your work

The DEV TEAM platform transforms how development tasks are approached by leveraging the power of multiple AI models working in parallel, providing faster, more comprehensive, and higher-quality results. 