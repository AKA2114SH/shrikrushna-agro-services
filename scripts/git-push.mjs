import git from 'isomorphic-git';
import fs from 'fs';
import path from 'path';

const dir = process.cwd();

async function main() {
  console.log('📦 Initializing Git repository in:', dir);
  
  try {
    await git.init({ fs, dir, defaultBranch: 'main' });
    console.log('✅ Git repository initialized with branch main.');

    // Stage all files
    console.log('📝 Staging files...');
    const files = await getFiles(dir);
    for (const file of files) {
      const relPath = path.relative(dir, file);
      if (
        relPath.startsWith('.git') ||
        relPath.startsWith('node_modules') ||
        relPath.startsWith('.next') ||
        relPath.startsWith('out')
      ) {
        continue;
      }
      await git.add({ fs, dir, filepath: relPath });
    }

    console.log('✅ All project files staged.');

    // Commit
    const sha = await git.commit({
      fs,
      dir,
      message: 'feat: Complete Shri Krishna Agro Services Digital Operating System & GitHub Pages deployment',
      author: {
        name: 'Akash Khatale',
        email: 'akashkhatale2114@gmail.com',
      },
    });
    console.log('✅ Committed successfully with commit SHA:', sha);

    // Add or update remote
    const remoteUrl = 'https://github.com/AKA2114SH/shrikrushna-agro-services.git';
    try {
      await git.addRemote({ fs, dir, remote: 'origin', url: remoteUrl });
      console.log('✅ Remote origin added:', remoteUrl);
    } catch {
      await git.deleteRemote({ fs, dir, remote: 'origin' }).catch(() => {});
      await git.addRemote({ fs, dir, remote: 'origin', url: remoteUrl });
      console.log('✅ Remote origin updated:', remoteUrl);
    }

    console.log('\n🎉 Git setup complete for remote: origin -> https://github.com/AKA2114SH/shrikrushna-agro-services.git');
  } catch (err) {
    console.error('Git operation error:', err);
  }
}

async function getFiles(dir) {
  const entries = await fs.promises.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const res = path.resolve(dir, entry.name);
      if (entry.isDirectory()) {
        if (
          entry.name === '.git' ||
          entry.name === 'node_modules' ||
          entry.name === '.next' ||
          entry.name === 'out'
        ) {
          return [];
        }
        return getFiles(res);
      }
      return res;
    })
  );
  return Array.prototype.concat(...files);
}

main();
