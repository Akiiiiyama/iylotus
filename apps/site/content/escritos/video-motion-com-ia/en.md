## Summary

- The video starts from **one sentence with commas**: each comma becomes a transition. Example: "Hi, I'm IY., Isabela Yukari, Design Engineer".
- The AI doesn't open After Effects: it **writes the animation as code** (an HTML page) and records it frame by frame into an MP4. That's why you can change any detail by asking in text.
- What makes the video feel *designed* is the **strategy**: a narrative arc and **one hero object** that travels through the whole video and closes the loop in the logo.
- The music **comes from you** (licensed). The AI analyzes the track, finds the hits and pins each transition to one.
- Before delivery, ask the AI to **check the frames**: one-frame glitches are easy to miss and show up on the phone.

---

## 1. What you'll create

A 10 to 20 second video, horizontal (16:9) or vertical (9:16, for Stories and Reels), with:

- animated type with the words of your sentence;
- guide lines and technical annotations, like a design tool;
- an object that transforms along the video (in the example, the red dot of the logo becomes a sphere, then the iris of an eye, and returns as the dot);
- the palette, fonts and easing curves of your design system;
- a synced soundtrack: the beat drops together with the first transition.

## 2. What to prepare before asking

| Item | Example | Why it matters |
|---|---|---|
| **Sentence with commas** | "Hi, I'm IY., Isabela Yukari, Design Engineer" | Sets how many scenes and transitions the video has. |
| **Reference** | A motion post or reel you admire | Gives pace and mood. If it's on Instagram, send screenshots or describe it: the AI usually can't play it without a login. |
| **Your brand** | Portfolio repo, Figma or website | Colors, fonts, logo and easing come from here. |
| **Format and length** | 16:9, 20 seconds | Vertical isn't a crop of horizontal: it needs to be recomposed. |
| **Mood in two words** | "futuristic and sweet" | Guides color use, motion weight and music. |
| **Licensed music** | An MP3 from a library you subscribe to | The AI doesn't download tracks from stock libraries for you. |

> Tip: decide **light or dark** at the start. It's the most expensive change once the video exists.

## 3. The strategy (what separates a nice video from a memorable one)

### A five-beat arc

1. **Hook**: something draws itself on screen (guide lines, a falling dot).
2. **Identity**: your name.
3. **Symbol**: a metaphor for how you work. In the example, an eye that opens, looks around and blinks: "design vision".
4. **Role**: what you do ("Design Engineer").
5. **Close**: the logo.

### One hero object that closes the loop

Pick an element of your logo (a dot, a letter, a shape) and let it **travel the whole video**. In the example:

red dot falls → becomes a glass sphere → becomes the iris of the eye → back to a sphere → shrinks into the dot of "IY.".

Starting and ending on the same element makes 20 seconds feel planned, not assembled.

### Cultural elements, with care

If the video carries your identity (in the example: vertical katakana, an ensō stroke and an almond-shaped eye), ask for it to be drawn elegantly, with fine lines and **no caricature**. Use it because it's part of who you are, not as decoration.

### Reading pace

Each phrase should stay **fully on screen for at least 1.5 seconds**. In the example, the first 12-second version felt too fast; the final one is 20.

## 4. Step by step with Claude Code

1. **Brief.** Send the sentence, the reference and where your brand lives. Example request:
   > I want a 20s motion video, 16:9, in the style of this reference. Text: "Hi, I'm IY., Isabela Yukari, Design Engineer". Each comma is a transition. Use the design system from my portfolio repo. Mood: futuristic with glassmorphism, but sweet.
2. **Strategy.** Ask for the arc and the hero object **before any code**, and approve the scene-by-scene script.
3. **First version as stills.** The AI builds the scene and shows a contact sheet with 9 to 12 key frames. Changing direction here is much faster than on a finished video.
4. **Adjust in text.** Real requests from this project:
   - "I don't want dark, I want my portfolio's palette."
   - "Put an East Asian almond-shaped eye in the middle of the video."
   - "At the end, the ball could shrink and become the red dot of IY."
   - "Don't go so fast, let the words appear more slowly."
5. **Music.** Send the file. The AI finds the tempo, the strong hits and the moment the beat drops (see section 5).
6. **Sync.** The AI retimes each scene so transitions land on the hits.
7. **Render and check.** The video is recorded at 60 frames per second. Ask for the bad-frame scan before you get the file.
8. **Delivery.** Get the MP4 and watch it with sound, on headphones.

## 5. Music: what to ask for and what to check

- **Find the right hit, not just the tempo.** Automatic rhythm analysis can be off by a ratio (in the example it read 80 BPM on a 120 BPM song). Ask the AI to check the list of strong hits.
- **Start near the "drop".** The moment the beat comes back after a breakdown is the best place for the first transition.
- **Avoid vocals.** Singing competes with on-screen text. Ask for an instrumental section and listen to confirm.
- **Splice only on the beat.** Cutting inside one of the song's own pauses sounds like a gap (it happened in the example).
- **End with the song's real ending**, instead of a fade in the middle of a phrase.
- **Rights:** to publish, the license must cover the platform. Another option is exporting the video with sound effects only and adding the music from Instagram's own library.

## 6. Common mistakes and how to avoid them

| Problem | What to do |
|---|---|
| A one-frame "blink" in the video | Ask for the bad-frame scan before delivery. |
| Glass (background blur) that disappears on some frames | Fake the glass with gradients and highlights, without background blur. |
| Too fast to read | At least 1.5s per phrase. Ask to slow down without changing the scene order. |
| Vocals over the text | Choose an instrumental section or swap the vocal bar for one without. |
| A gap at the end of the music | Use the track's real ending, spliced on the beat. |
| Generic ending ("a ball opens with the logo inside") | Close the loop: the hero object becomes part of the logo. |
| Vertical version cropped from horizontal | Recompose the scene at 1080×1920. |

## 7. Final checklist

- [ ] Sentence split by commas, each transition named
- [ ] One hero object that starts and ends the video
- [ ] Colors, fonts and easing from your design system
- [ ] Each phrase readable for at least 1.5s
- [ ] Transitions on the strong hits of the music
- [ ] Section without vocals, no gaps at splices, a musical ending
- [ ] Bad-frame scan clean
- [ ] Watched with sound before publishing

---

For Claude Code users, the whole process is packaged in the [`brand-motion-intro`](https://github.com/Akiiiiyama/skills-para-designers/tree/main/skills/01-explore/brand-motion-intro) skill, in the *skills-para-designers* repo, with the render, beat-analysis, audio-splice and frame-scan scripts.
