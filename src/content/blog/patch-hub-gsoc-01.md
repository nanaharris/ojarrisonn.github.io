---
title: 'Patch-Hub on GSoC 2025 #01'
description: 'Well back to planning phase'
pubDate: 'Fev 9 2025'
heroImage: '/patch-hub.png'
tags: ['patch-hub', 'gsoc-2025']
---

> First of all, I can't thank enough [David Tadokoro](https://github.com/davidbtadokoro) and the [kworkflow](https://github.com/kworkflow) organization for this opportunity.

I'm applying to work at [`patch-hub`](https://github.com/kworkflow/patch-hub) for this year GSoC. I've done some previous work with `patch-hub` focusing on doing some improvements on UX and UI during the second half of 2024. But now I'm planning something bigger.

## Current Status

`patch-hub` is, so far, a (mostly) single-threaded Rust TUI application. This is not bad at all, but it has several limitations and `patch-hub` is hitting a celling due to Rust strict rules. The current architecture is sort of rigid and very coupled, making it difficult to add on more functionality.

If I'd have to describe `patch-hub` core structure I'd outline something like:

- `lore`: definitions to interact with [lore](https://lore.kernel.org)
- `app`: main logic, triggers renders, receive user interactions, store state and data
- `app::logging`: global logger for events
- `app::config`: deal with settings loading
- `ui`: defines screens that are drawn to the terminal
- `handler`: defines how to handle user input

And some stuff are really highly coupled. The best example are `ui` related stuff which deal directly with `ratatui` primitives for drawing on terminals. This could become a huge headache once `ratatui` decides to change those stuff or we decide to use another TUI library.

Also, the borrow checker is starting to hit us and block some implementations. For instance: pop-ups. Currently pop-ups can only display information. They cannot mutate the app state in any sense. Why? In Rust values have owners, they can be borrowed either mutably or immutably. But the borrow checker states that if you have a mutable borrow ongoing, no more borrows can exist.

Well, a pop-up is owned by the application, so in order to have access to a pop-up we need to reference the application (currently almost every reference to the application are done via mutable borrows), but to let a pop-up mutate the current app state, it need to receive a mutable reference to the application. Oops, the borrow checker won't ever approve this. At least, not how it's implemented as of now.

Let me also show you how using `patch-hub` looks like now.

<img src="/assets/projects/patch-hub/patch-hub-v014-home.png" alt="Tela inicial patch-hub"></img>

When stating `patch-hub` you'll be received with our beautiful home screen with a list of kernel mailing lists to choose and some keybinds listed below.

## Objectives

The main objectives of my work with `patch-hub` are increasing its flexibility and decoupling. And I'm planning on doing so by refactoring `patch-hub` to use the [Actor Model](https://en.wikipedia.org/wiki/Actor_model). In short, this concurrent model states that everything in the program should be an actor, each actor executes on an isolated environment, can create new actors and may communicate with other actors via messages. So probably the smart choice is to first think about which actors `patch-hub` would need.

- **Lore**(`lore`): interface to interact with the lore API
- **View**(`ui`): draws to the terminal
- **App**(`app`): manages app state
- **Config**(`app::config`): manages app configuration
- **Controller**(`handler`): handles user input
- **File**(spread across different locations): manages file IO
- **Logger**(`app::logging`): logs messages
- **Terminal**: handles terminal interactions

Also, keep in mind that we won't stick to the "everything is an actor" philosophy. Some pieces of the `patch-hub` code will be just reorganized in different folders but still be just regular library structs, functions, etc. outside of the actor model.

The actors will communicate with each other using messages. The main messages that will be handled are:

- **Lore**: will be responsible for fetching data from the lore API

  - `Lists`: return the mailing lists from lore
  - `Page`: get a page of patches from a mailing list
  - `Details`: get the details of a patch

- **View**: is responsible for rendering the UI on the terminal

  - `Render`: render a given screen with some payload data
  - `Detach`: detaches the view from the terminal allowing for other CLI tools to use it
  - `Attach`: attaches the view back to the terminal

- **App**: controls the application state

  - `[Set]State`: get/set the state of the app
  - `Text`: send a text character to the app for input buffers

- **Config**: deals with configuration options

  - `[Set]*`: couple of getters and setters for each configuration option
  - `Save`: save the current configuration to the config file
  - `Reload`: loads the configuration once again

- **Controller**: won't receive incoming messages, but will send messages to other actors when a given chord or melody happens based on the app state and defined keybindings

  - `Chord`: indicates that a combination of keys where pressed at the same time
  - `Melody`: defines an action to be performed when a given melody happens

- **File**: deals with file IO

  - `Read`: read a file
  - `Write`: write a file

- **Logger**: responsible for logging information

  - `Info`: log an info message
  - `Warn`: log a warning message
  - `Error`: log an error message

- **Terminal**: handles terminal interactions

The amount of messages each actor receives is a good indicator that the actor is not doing too much. If an actor receives too many messages, it might be a good idea to refactor it into smaller actors.
