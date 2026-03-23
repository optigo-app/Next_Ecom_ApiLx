# Resolving GitHub Large File Push Errors

If your `git push` fails because a file exceeds GitHub's 100MB limit (e.g., `remote: error: File X.zip is 143.76 MB; this exceeds GitHub's file size limit`), follow these steps to fix your history and push successfully.

## Scenario: You accidentally committed a large file recently

If the large file was included in your last few local commits and hasn't been pushed to the server yet, follow these steps:

### 1. Undo the local commits (Keep your changes)

Perform a "soft reset" to the last known good commit on the server. This moves your changes back to the "staged" area but removes the actual commits from history.

```bash
# Replace 'rajan' with your branch name
git reset --soft origin/rajan
```

### 2. Unstage the large file

Remove the specific large file from the staging area so it won't be included in the next commit.

```bash
# Replace 'large-file.zip' with your file's name
git reset path/to/large-file.zip
```

### 3. Ignore the file permanently

Add the file to `.gitignore` so you don't accidentally add it again in the future.

```bash
echo "path/to/large-file.zip" >> .gitignore
```

### 4. Re-commit only the valid changes

Now that the large file is unstaged, you can commit your genuine code changes.

```bash
git add .
git commit -m "Your clean commit message"
```

### 5. Push to GitHub

```bash
git push origin your-branch-name
```

---

## Alternative: Using Git LFS (Permanent Solution)

If you _must_ keep large files in your repository, use **Git Large File Storage (LFS)**.

1. **Install Git LFS**: Download and install from [git-lfs.github.com](https://git-lfs.github.com).
2. **Initialize LFS**:
   ```bash
   git lfs install
   ```
3. **Track large files**:
   ```bash
   git lfs track "*.zip"
   git add .gitattributes
   ```
4. **Commit and Push**: Git LFS will handle the upload to a separate storage area that supports large files.

---

## Pro Tip: Finding the Large File

If you aren't sure which commit contains the large file, use this command to find it:

```bash
git rev-list --objects --all | findstr "zip"
```

Once you find the file name, follow the **Revert** steps above.
