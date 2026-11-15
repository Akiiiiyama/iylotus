## Summary

- The reference was a creative-direction reel. Only its **grammar** comes along: cuts on the beat, light/bold weight pairs, mono labels and a fast sequence at the end. The content is yours.
- To make it about Design Engineering, **every scene shows design and code side by side**: the Figma selection box with its CSS, "pixels" that become "code", the logo as a token, a component and a commit.
- The rhythm comes from a **beat grid**. Every scene starts on a beat, and the big changes land on strong hits.
- One **thread** runs through the video: the red dot is the text caret at the start and the period at the end.
- The music uses only the **opening of the track, before the vocals**.
- In revisions, ask for **only the change you want** and say what should stay.

---

## 1. The script in 7 scenes

| Scene | When | What appears |
|---|---|---|
| **Hello.** | 0 s | Dark grid. The red caret types "Hello" and becomes the period. A Figma selection box shows `x y W H` and the CSS `font: 700 170px "DM Sans";` |
| **Name** | 2.25 s (hit) | Cut to white. "I'm" rises and "Isabela **Yukari**" is typed in light and bold. |
| **Roles** | 4.56 s | Design **Engineer** on red, then Product **Designer** on light gray. Each stays for a few beats. |
| **Principle** | 8.71 s (hit) | "I design in **pixels**" with design icons orbiting. On the next beat, "and ship in **code**." and each icon turns into a code icon. |
| **Skills** | 10.10 s | "I ship •" and a wheel that turns one item per beat, the active one in red. |
| **Craft** | 11.48 s | 8 artifacts in quick succession: tokens, code editor, spacing, dark mode, button states, responsive frames, AA contrast and a commit. |
| **Close** | 12.40 s (hit) | Name in light and bold, the red dot drops in as the period and `DESIGN ENGINEER — 2026` is typed below. |

## 2. Step by step with Claude Code

1. **Install the skill** [`brand-motion-intro`](https://github.com/Akiiiiyama/skills-para-designers/tree/main/skills/01-explore/brand-motion-intro). The full recipe for this reel is in `references/kinetic-reel.md`.
2. **Ask with context.** Example:
   > Act as a craft design expert and take inspiration from this video, always coming back to Design Engineer. 14 s vertical reel. Roles in order: Design Engineer, then Product Designer. Use my portfolio's design system and ~/Downloads/track.mp3, only the part before the vocals.
3. **Approve the proposal before any code.** Claude analyzes the reference and proposes the scenes. Adjust order and wording here, where it is cheapest.
4. **Music.** Claude finds the tempo (130 BPM in the example), the strong hits and where the vocals start (at 14 s, which is why the video is 14 s long). If a spoken word sits in the middle, it swaps that stretch for an identical earlier one, cut on the beat.
5. **1080p preview.** Check a contact sheet first, then the video. Watch it with sound.
6. **Adjustments.** A real example: "for the sequence I want Design Engineer and then Product Designer". If Claude changes more than you asked, say what should come back.
7. **High resolution.** Once approved: 2160×3840 for Reels.
8. **Desktop version.** Ask "now in desktop format, high resolution". The scene is re-composed in 16:9 (3840×2160), not cropped from the vertical one.

## 3. Colors

With black, the strongest and most coherent combination is **black + white + one saturated accent**, such as the brand red, on about 10% of the screen. Gray supports labels and code. A second saturated accent (lime green, electric blue) competes with the first: use one or the other.

## 4. Common mistakes

| Problem | What to do |
|---|---|
| I asked for a tweak and scenes I liked disappeared | Say exactly what to change and what to keep. Ask to go back to the previous version and change only that part. |
| Video too fast | Fewer items per scene, or more beats per item. Don't cut what you liked without deciding to. |
| Vocals over the text | Use only the instrumental opening. Replace spoken words with identical stretches, on the beat. |
| Text under the Instagram UI | Keep labels and text away from the top and bottom in 9:16. |
| Horizontal version cropped from the vertical | Re-compose the scene in 16:9. |
| Scene files lost | Keep scenes in a repository. Temporary folders get wiped. |

## 5. Checklist

- [ ] Reference translated into your craft, not copied
- [ ] Every scene shows design and code
- [ ] Roles in the order you chose
- [ ] Cuts on the beat, big changes on strong hits
- [ ] One thread from start to end
- [ ] Music without vocals
- [ ] Preview approved before high resolution
- [ ] 9:16 and 16:9 versions both composed
- [ ] Scenes saved in a repository
