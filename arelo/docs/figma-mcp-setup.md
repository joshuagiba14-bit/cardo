# Connect Figma's Dev Mode MCP server to Claude Code

This lets Claude Code read your Figma frames (layout, spacing, colors, text,
variables) directly from a link or from your current selection.

> Figma changes its menus from time to time. If a step below doesn't match
> what you see, check Figma's official guide: search "Figma MCP server" in
> Figma's help center.

## What you need

- A Figma plan that includes **Dev Mode** (a paid Professional, Organization
  or Enterprise seat with Dev or Full access).
- The **Figma desktop app** (the browser version can't run the local server).
- Claude Code installed on your computer.

## Option A: Desktop server (recommended)

1. Open the **Figma desktop app** and make sure it's up to date
   (Figma menu → _Check for updates_).
2. Open any design file.
3. Switch to **Dev Mode**: press `Shift` + `D`, or click the `</>` toggle
   in the toolbar.
4. In the right-hand **Inspect** panel, find the **MCP server** section and
   click **Enable desktop MCP server**. (In older versions: Figma menu →
   _Preferences_ → _Enable Dev Mode MCP Server_.)
5. A message confirms the server is running at
   `http://127.0.0.1:3845/mcp`. Leave the Figma app open while you work.
6. In a terminal, inside the `arelo` folder, run:

   ```bash
   claude mcp add --transport http figma-desktop http://127.0.0.1:3845/mcp
   ```

7. Start Claude Code (`claude`) and type `/mcp`. You should see
   `figma-desktop` listed as **connected**.

## Option B: Remote server (no desktop app needed)

1. In a terminal, run:

   ```bash
   claude mcp add --transport http figma https://mcp.figma.com/mcp
   ```

2. Start Claude Code, type `/mcp`, select `figma`, and choose
   **Authenticate**. A browser window opens. Log in to Figma and click
   **Allow access**.

## How to use it

- **With a link:** in Figma, right-click a frame → _Copy/Paste as_ →
  _Copy link to selection_. Paste the link to Claude Code: "Build this
  screen: <link>".
- **With a selection (desktop server only):** select a frame in the Figma
  app, then tell Claude Code "build my current Figma selection".

## Tips for better results

- Use **Auto layout** on every frame. It becomes real flexbox/grid.
- Use **variables** for colors, spacing and radius, not hardcoded values.
- Name layers and components clearly (e.g. `Button/Primary`,
  `EvaluationCard`). Components get the same name in `src/components/ui/`.
- Make a separate frame for each state: empty, loading, error, mobile.

## Note for cloud sessions

The desktop server only runs on your own computer, so it isn't reachable
from a Claude Code session running in the cloud (claude.ai/code). For
Figma-driven phases, use Claude Code on your computer with Option A, or
try Option B.
