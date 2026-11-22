## Summary

- **There is a process**, and each step in it is a layer of protection. The first rule is that nobody touches main directly.
- GitHub works like **Figma branches**: a main file, a branch to make changes without getting in anyone's way, a review request and a merge.
- A change goes through **three places**: your computer, GitHub and the live site. Commit, push and merge move the change from one place to the next.
- A **pull request is a question**, not a change: someone else reviews it before anything goes in.
- With AI you don't need to type commands, but you do need to **know how to check each step** before you approve it.

---

## 1. The fear of breaking the code

One of the things I see most among designers when it comes to GitHub is fear. Fear of opening a PR and ruining someone's code, of pressing the wrong button and taking the site down, of touching something the whole team uses.

It's understandable: the first time you open a repository, it feels like every click is permanent. But GitHub was built precisely so that this doesn't happen. **There is a process, and if you follow the process, you won't break anyone's code.** Each step exists so the change is seen, tested and approved before it goes live.

This guide explains each word with that in mind, always with a comparison that helps a lot: **GitHub works like Figma branches.**

A few names before we start:

- **Git** is the tool that keeps the history of every change in a project, on your computer.
- **GitHub** is the website where that history is stored in the cloud, so the whole team can work together.
- A **repository** (or *repo*) is the project folder with all that history inside. It's the "Figma file" of the code.

## 2. The 8 words

### GitHub

![Two areas: at the top, GitHub, the team's project in the cloud, with the person who reviews. At the bottom, on your machine, with the person who creates and the laptop](/escritos/github-para-designers/01-github.jpg "Each person works on their own machine, and GitHub brings everything together in one place.")

GitHub is **where the team's project lives**, in the cloud. Each person works on a copy on their own computer and, when they're done, sends what they did there. GitHub is where the team sees, reviews and combines everyone's work.

### Main

![The main line with three white commits and the label live on the last one](/escritos/github-para-designers/02-main.jpg "Main is the official line. Its latest commit is what's live.")

**Main** is the official version of the project, and it's usually the one that's live. It's the main Figma file, the one everybody uses.

Why it protects you: **nobody touches main directly**. Many teams set GitHub up to block it (the setting is called *branch protection*), so even if someone tries, GitHub won't let them.

### Branch

![A dashed line leaves main and goes down to your machine, where it becomes the red line my-branch](/escritos/github-para-designers/03-branch.jpg "The branch starts from a point on main and becomes your line of work.")

A **branch** is a copy of main for you to change freely, like creating a branch of a Figma file. It starts from a point on main and, from then on, everything you do stays in it.

Why it protects you: **if you make a mistake on your branch, main never finds out.** You can test, fail and redo as many times as you need.

### Commit

![On your machine, three hollow circles appear on the branch line, each with a flash](/escritos/github-para-designers/04-commit.jpg "Each commit is a saved snapshot. The hollow circles show they're still only on your computer.")

A **commit** is a saved snapshot of your changes, with a message saying what changed ("Card: padding from 16 to 24px"). It's like saving a named version in Figma's version history.

Why it protects you: the commit stays **only on your computer**, so nobody sees it yet. And since each commit is a snapshot, you can go back to any of them.

### Push

![The commits go up from your machine to GitHub and become filled red circles on a line below main](/escritos/github-para-designers/05-push.jpg "On push, the commits go up to GitHub. Main stays the same.")

**Push** sends your commits from your computer to GitHub. Now the team can see your branch.

Why it protects you: notice that **main stays exactly the same**. Uploading a branch changes nothing that's live. The opposite of push is **pull**: bringing to your computer what others have already sent.

### Pull request (PR)

![The branch on GitHub sits inside a dashed outline, Pull Request #2 approved, and the person who reviews says approved](/escritos/github-para-designers/06-pull-request.jpg "The PR is the conversation: the person who creates asks for a review and the person who reviews approves.")

A **pull request** is the request to merge your branch into main, like "Request review" on a Figma branch. It's the heart of the process: **someone else reviews it before anything goes in**, comments line by line, asks for changes and approves.

In many projects, the PR also runs **automated tests** (the *checks*), which warn you if something broke, and creates a **preview link** so you can see the change working before it goes live.

Why it protects you: opening a PR isn't changing anyone's code. It's **asking a question**: "can I merge this?".

### Merge

![The red branch line goes back into main as a new commit, and the live label moves to it](/escritos/github-para-designers/07-merge.jpg "On merge, the branch goes back into main and the new version goes live.")

**Merge** combines the branch into main. It's Figma's "Merge branch". The change becomes official and, if the team publishes main automatically, it goes live.

Why it protects you: the merge only happens **after approval** and with the tests passing.

### Tag

![A red v1.1.0 label attached to the merge commit on main](/escritos/github-para-designers/08-tag.jpg "A tag gives a version a name.")

A **tag** gives a version a name, for example `v1.1.0`. It's like naming a Figma version "v1.1, handed off to dev".

Why it protects you: with a tag, you know exactly what was live on each date and can **go back to that version** if you need to.

### The 8 words in a table

| Word | What it is | In Figma it would be |
|---|---|---|
| GitHub | Where the team's project lives, in the cloud | The team account, where the files are |
| main | The official version, usually the one that's live | The main file, the published library |
| branch | A copy to change without affecting main | Creating a branch of the file |
| commit | A saved snapshot of the changes, with a message | Saving a named version |
| push | Sends the commits to GitHub | Syncing to the cloud so the team can see |
| pull request | The request to merge the branch into main, with review | The branch's "Request review" |
| merge | Combines the branch into main | "Merge branch" |
| tag | A name for a version | A named version, "handed off" |

## 3. The three places your change can be

Almost every confusion with Git comes from not knowing **where** the change is at that moment. There are three places, and each step moves the change from one to the next.

| Place | What happens there | Who sees it |
|---|---|---|
| **Your computer** | You (or the AI) edit the files. A commit saves to the history, but only here | Only you |
| **GitHub** | Push sends the commits here. This is where the PR and the review happen | The team |
| **The live site** (production) | Usually a tool like Vercel watches main and publishes everything that goes into it automatically | Everybody |

One sentence to remember: **commit saves on your computer, push takes it to GitHub, and merging into main takes it live.**

## 4. The full flow, step by step

The scenario: the project is already live and you want to adjust the padding of a card. You don't need to memorize the commands. The goal is to recognize each one when the AI (or a developer) runs it, and to know what it does.

```bash
# 1. Go to main and bring in what others have already merged
git switch main
git pull

# 2. Create your branch from the updated main
git switch -c ajuste/espacamento-card

# 3. Edit the files (in your editor, or the AI edits them)

# 4. Check what changed before saving
git status    # which files changed
git diff      # the exact lines: what came out and what went in

# 5. Choose what goes into the commit and save it with a message
git add src/components/Card.css
git commit -m "Card: padding from 16 to 24px, as in Figma"

# 6. Send the branch to GitHub
git push -u origin ajuste/espacamento-card

# 7. Open the PR (or click "Compare & pull request" on the GitHub website)
gh pr create --base main --title "Card: padding as in Figma"

# 8. After the merge, go back to main and update it
git switch main
git pull
```

A few notes on these steps:

1. **`git pull` before you start** avoids starting from an old version of main, which is the main cause of conflicts.
2. **`git diff` before the commit** is the moment to check that only what you expected has changed.
3. **`git add` with the file name** (instead of `git add .`, which takes everything) avoids taking along files you didn't want.
4. **The `-u` on push** is only needed the first time: it links your local branch to the branch on GitHub.
5. **Changes requested in review go on the same branch.** You make a new commit, push, and the PR and the preview update on their own. You don't need to open another PR.

### What to write in the PR description

The description is what lets someone approve without having to ask anything. Four blocks cover almost everything:

```markdown
## What changed
Card padding from 16 to 24px.

## Why
To match Figma (link to the frame).

## How to test
Open /projects in the preview, on desktop and mobile.

## Before and after
(screenshot) (screenshot)

Closes #12
```

`Closes #12` links the PR to **issue** 12 (the request recorded on GitHub). When the PR goes into main, the issue closes on its own.

## 5. The same flow, asking the AI

With Claude Code (or Copilot), you ask in plain language and the AI runs the commands. Your role changes: instead of typing, you **check** each step before approving it. The AI asks for permission for commands like `git push`, so read the command before you click allow.

| Step | What to ask | What to check |
|---|---|---|
| Start | "Update main and create a branch `ajuste/espacamento-card` to adjust the card." | Did it run `git pull` first? Does the branch name say what it is? |
| Change | "Make the change and show me the diff before committing." | Did only the files you expected change? |
| Commit | "Commit only the card files, with a message that says what changed and why." | Is the message clear? One topic per commit? |
| PR | "Push the branch and open a PR to main with: what changed, why, how to test and the Figma link." | Does the PR point to main? Is the description complete? Did the preview open? |
| Review | "Someone commented on the PR that the spacing is too big on mobile. Fix it on the same branch and push." | Did it use the same branch, without opening a new PR? |
| Understand | "Explain this PR to me file by file, in plain language, and what could break." | This works for reviewing other people's PRs too. |

### Red flags: stop and ask before approving

| If you see | Why it's dangerous |
|---|---|
| A commit or push straight to main | It skips the review. Everything goes through a branch and a PR. |
| `git push --force` | It overwrites the history on GitHub and can erase someone else's work. On a shared branch, never. |
| `git reset --hard` | It throws away changes for good. Ask what will be lost. |
| `.env`, a password or a key in the diff | A secret that goes to GitHub has to be replaced, even if you delete it later. |
| Files you didn't ask for | `node_modules`, `.DS_Store` and build files belong in `.gitignore` (the list of what Git ignores). |
| Turning off a test so the PR passes | The test failed for a reason. Ask the AI to explain the reason, not to hide it. |

## 6. How it works with a team

### Does main always go live?

In most teams, yes, but it's worth asking. The common setup has three environments:

| Where the code is | Where it goes | What it's for |
|---|---|---|
| A branch with an open PR | **Preview**: a temporary link for that PR only | Testing and doing the design review before merging |
| main | **Production** (or **staging**, a "pre-production", in bigger teams) | The official version. That's why nobody touches it directly |
| A tag (`v1.1.0`) | A marked **release** | Knowing what was live on each date and being able to go back |

A question for your first day on a team: **"What happens when something goes into main? Does it go straight live or through staging?"** The answer changes how careful you need to be with the merge.

### The path of a change, from request to live

1. **Open an issue.** The written request on GitHub: what to change, why, the link to the Figma frame and when it's done.
2. **Agree on it.** Who changes what? Is it only the screen (front-end) or does it need new data from the back-end? Agreeing first avoids two people in the same file.
3. **Branch and commits.** Whoever implements it creates the branch from the updated main and makes small commits with clear messages.
4. **Open the PR early, as a draft.** A PR marked as *draft* shows the direction before it's finished. You can correct course at the start, not at the end.
5. **Checks and preview.** The automated tests run (on GitHub this is called **GitHub Actions** or **CI**) and the deploy tool creates the preview link. A red check means something broke.
6. **Review.** Engineering reviews the code. You review the screen in the preview (the design review) and comment on the PR itself, with a screenshot and the Figma link.
7. **Changes on the same branch.** Each new push updates the same PR and the same preview.
8. **Approval and merge.** With approval and green checks, the PR goes into main. The branch is deleted (the commits stay in main).
9. **Deploy and check.** Main goes live. Check it in production. The issue closes on its own if the PR had `Closes #`.

### Where each conversation happens

| Conversation | Where |
|---|---|
| The request and the reason | In the **issue** |
| The conversation about that change | In the **PR**, with comments on the exact line |
| A quick alignment | In chat or on a call, but the final decision goes back to the issue or the PR |

That way nobody depends on remembering "what we agreed on that call".

## 7. I want to change something mid-project. Now what?

This is the most common question when a screen is already being built. The answer depends on **where the work is** and on **the size of the change**.

| Situation | What to do |
|---|---|
| **It hasn't started yet** | Change the request, not the code: update Figma and the issue, and let people know before the branch is created. |
| **Open PR, small change** (spacing, color, copy) | Comment on the PR itself, with the frame link and a screenshot. Whoever is implementing it makes the change in a new commit, on the same branch. |
| **Open PR, big change** (a flow, a new component) | Don't change the PR's goal halfway. Let it finish, open a new issue and make the change in a new PR later. |
| **It's already in main** | A new branch from the updated main and a new PR. Never straight to main. |

Two rules that apply in every case:

- **Don't edit someone else's branch without agreeing first.** It would be like going into someone's Figma branch and changing the frame they're designing. If you agree that you'll make the change yourself, say so on the PR and run `git pull` on the branch before touching it.
- **A new change calls for a new PR.** Small PRs are easier to review and to undo.

### When the change needs new data

Many projects have a **BFF** (*Backend for Frontend*): a server layer made to measure for the screen, which fetches data from several systems and delivers it in the shape the screen needs.

- A **visual-only** change (spacing, color, copy) doesn't touch the BFF.
- A change that **needs new data** (for example, showing the balance on the card) touches the BFF and the front-end.

In the second case, agree with whoever owns the back-end on the shape of the data (the "contract") before any code. The safe order is: **first the BFF PR**, which *adds* the new data without removing anything that already exists, and goes live without breaking the current screen. **Then the front-end PR** starts using the data.

## 8. Conflict: when two people change the same line

While you were working on your branch, someone else changed **the same line** and already merged it into main. Git doesn't know which of the two versions wins, so it stops and asks. The file looks like this:

```css
.card {
<<<<<<< main
  gap: 16px;
=======
  gap: 24px;
>>>>>>> ajuste/espacamento-card
}
```

The top part is what's in main, and the bottom part is what's in your branch. Resolving it means choosing (or combining) the versions and deleting the markers.

With the AI, ask: *"There's a conflict with main. Show me both versions of each conflict and explain what each one does before resolving it."* If the choice is about design, it's your decision. If it's about logic, agree on it with the person who made the change.

In Figma it's the same: when you merge a branch and someone changed the same layer in the main file, Figma shows both sides and asks which one to keep. **A conflict isn't an error: it's the system asking for a decision.** Short branches and frequent `git pull` keep conflicts rare.

## 9. Undoing without panic

The right way to undo depends on how far the change got. The further it went, the safer it is to undo by **creating** something new rather than deleting.

| Situation | Command | What it does |
|---|---|---|
| I edited and want to discard it (no commit yet) | `git restore file` | Puts the file back as it was in the last commit. The edit is lost. |
| I got the last commit's message wrong (not pushed yet) | `git commit --amend` | Rewrites the last commit. Only before pushing. |
| I committed to main by mistake (not pushed yet) | Ask the AI to "move this commit to a new branch" | Creates the branch with the commit and leaves main as it was. |
| It's already in main and broke something live | `git revert <commit>` (or the "Revert" button on the PR) | Creates a new commit that undoes the previous one, without erasing history, and goes through a PR like any other change. |

`revert` is the answer to the fear from the beginning: **even after the merge, you can undo it.** The mistake becomes just one more chapter in the history.

## 10. Good practices, even when vibe coding

1. **Never straight to main.** Everything goes through a branch and a PR. In team repositories, turn on main protection (Settings → Branches).
2. **`git pull` before you start.** Starting from an old main is the main source of conflicts.
3. **Short, named branches.** `feat/statement-filter`, `fix/mobile-button`, `design/card-padding`. They live for days, not weeks. Ask whether the team has a convention.
4. **Small commits, one topic.** Easy to review and to undo just that part.
5. **A message that says what and why.** "Card: padding from 16 to 24px, as in Figma", not "tweaks" or "wip". Many teams use the `feat:` / `fix:` convention.
6. **Small PRs, with a description.** What changed, why, how to test, before and after. A 50-line PR gets really reviewed; a 2,000-line one gets approved without being read.
7. **Read the diff before approving**, especially what the AI did. A file you didn't expect to see is a reason to ask.
8. **Secrets don't go into Git.** Keys and passwords stay in `.env`, and `.env` stays in `.gitignore`. If one leaked, replace the key.
9. **Green checks before merging.** A red check is the project telling you something broke.
10. **Delete the branch after merging.** The commits stay in main and the branch list stays clean.
11. **A README that explains the project**: how to run it and how to contribute. It's the first thing a teammate (or an AI) reads.
12. **Tag important versions.** `v1.0.0` when it goes live. It makes it easy to know what was published and to go back.

## 11. Command cheat sheet

The commands you'll see the AI run, from safest to most dangerous:

| Command | What it does | Risk |
|---|---|---|
| `git status` | Shows which branch you're on and what changed | None, read-only |
| `git diff` | Shows the lines that changed and aren't in a commit yet | None, read-only |
| `git log --oneline` | Lists the commits, one per line | None, read-only |
| `git switch -c name` | Creates a branch and switches to it | None |
| `git switch name` | Switches branches | Low |
| `git pull` | Brings in what changed on GitHub | Low (may cause a conflict) |
| `git add file` | Stages the file for the next commit | Check it didn't pick up extra files |
| `git commit -m "…"` | Saves the snapshot to the history, on your computer | Low |
| `git push` | Sends the commits to GitHub | Medium: the team can now see it |
| `gh pr create` | Opens a pull request | Low |
| `git revert` | Undoes a commit by creating another one | Low, it's the safe way |
| `git reset --hard` | Deletes changes for good | **High** |
| `git push --force` | Overwrites the history on GitHub | **High** |

## 12. A path to practice

Practice in a repository of your own, where mistakes don't get in anyone's way:

1. **The full cycle.** Ask the AI to create a branch for a small change (a line in the README, for example), read the diff, open the PR and do the merge yourself on the GitHub website. You're ready when you can say, at each step, where the change is: on your computer, on GitHub or live.
2. **PRs, reviews and issues.** Open an issue, ask for a PR that solves it and review it by commenting on lines in GitHub. Then ask the AI to review the same PR and compare it with your reading.
3. **When things go wrong.** On purpose, create two branches that change the same line and ask the AI to explain the conflict before resolving it. Turn on main protection in the repository.
4. **From merge to live.** In a project with automatic deploys, do the design review through a PR's preview link, and create a tag and a release after the merge.

![Closing: each one on their own branch, everyone on the same main, with the sequence branch, commit, push, PR, merge and tag](/escritos/github-para-designers/09-resumo.jpg "The whole flow in one line.")

## Takeaways

What breaks code isn't a designer opening a PR, it's **skipping steps**: touching main directly, merging without review, ignoring the test that turned red. If you follow the path, the worst that can happen is someone commenting on your PR asking for a change, and that's great, because that's how we learn together with engineering.

If you can only keep one sentence: **each one on their own branch, everyone on the same main.**

And when vibe coding, the AI types the commands, but you're the one who decides. Knowing where the change is and what each step protects is what lets you approve what the AI did with confidence, or stop and ask first.
