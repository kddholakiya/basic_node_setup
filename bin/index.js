#!/usr/bin/env node

import inquirer from 'inquirer';
import chalk from 'chalk';
import bcrypt from 'bcryptjs';
import fs from 'fs-extra';
import ora from 'ora';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ✅ Your hashed password (generate once — see Step 3)
const HASHED_PASSWORD = '$2a$10$a2uZdR5YW8oWLVARsAdc1u3z6GaQ.vCyIwz7h6eD9VE7um.BhBzC.';

const TEMPLATES = {
  'JavaScript'         : 'javascript',
  'TypeScript'         : 'typescript',
  'JavaScript (Encrypted)': 'enc_javascript',
  'TypeScript (Encrypted)': 'enc_typescript',
};

async function main() {
  console.log(chalk.bold.hex('#7c6ff7')('\n  ⚡ Welcome to create-myapp CLI\n'));

  // ─── Step 1: Password check ───────────────────────────
  const { password } = await inquirer.prompt([
    {
      type: 'password',
      name: 'password',
      message: 'Enter CLI password:',
      mask: '*',
    },
  ]);

  const isValid = await bcrypt.compare(password, HASHED_PASSWORD);
  if (!isValid) {
    console.log(chalk.red('\n  ✖ Incorrect password. Access denied.\n'));
    process.exit(1);
  }

  console.log(chalk.green('  ✔ Password verified!\n'));

  // ─── Step 2: Project config ───────────────────────────
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: 'Project name:',
      default: 'my-app',
      validate: (v) => v.trim() !== '' || 'Project name is required',
    },
    {
      type: 'list',
      name: 'template',
      message: 'Select project template:',
      choices: Object.keys(TEMPLATES),
    },
  ]);

  const templateKey  = TEMPLATES[answers.template];
  const projectName  = answers.projectName.trim();
  const targetDir    = path.join(process.cwd(), projectName);
  const templateDir  = path.join(__dirname, '../templates', templateKey);

  // ─── Step 3: Copy template ────────────────────────────
  if (fs.existsSync(targetDir)) {
    console.log(chalk.red(`\n  ✖ Folder "${projectName}" already exists.\n`));
    process.exit(1);
  }

  const spinner = ora(`Setting up ${chalk.cyan(projectName)}...`).start();

  try {
    await fs.copy(templateDir, targetDir);

    // Rename gitignore if needed
    const gitignore = path.join(targetDir, 'gitignore');
    if (fs.existsSync(gitignore)) {
      fs.renameSync(gitignore, path.join(targetDir, '.gitignore'));
    }

    spinner.succeed(chalk.green(`Project "${projectName}" created successfully!`));

    console.log(`
  ${chalk.bold('Next steps:')}

  ${chalk.cyan(`cd ${projectName}`)}
  ${chalk.cyan('npm install')}
  ${chalk.cyan('cp .env.example .env')}
  ${chalk.cyan('npm run dev')}
    `);

  } catch (err) {
    spinner.fail(chalk.red('Failed to create project.'));
    console.error(err);
    process.exit(1);
  }
}

main();