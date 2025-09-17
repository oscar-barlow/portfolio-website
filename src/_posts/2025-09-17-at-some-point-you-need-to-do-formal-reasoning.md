---
layout: post
title: "At some point, you need to do formal reasoning"
date: 2025-09-17
---
When you are building software you are building a [formal system](https://www.britannica.com/topic/formal-system), and that means at some point you need to do formal reasoning.

Let's start with the stops vs. legs example from Eric Evans' 2019 talk ['What is DDD?'](https://www.youtube.com/watch?v=pMuiVlnGqjk) If you haven't seen the talk it's worth watching on its own merits. 

<iframe width="560" height="315" src="https://www.youtube.com/embed/pMuiVlnGqjk?si=iVpJ22YKFCOsc7zf" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>


Just to briefly recap: building a software system for logistics around the concept of 'cargo', 'stops', or 'legs' is a significant choice, and has big ramifications for the code you produce. Actually, different parts of the system are highly likely to treat different concepts as primary, which can create complication when you have to translate between them. And that's before we've come to the messiness of the real world - both the general rules of how cargo/stops/legs are to be treated, and likely numerous exceptions to these rules, what developers normally call 'edge cases'.

Bringing this back to using AI in software development, here's a quote from Evans' talk:
> We're used to just hearing words and, you know, we get the gist of what's being said, you get the meaning of what I'm saying but [we're] not paying enough attention to the words themselves...

When you look at a popular SaaS product that's been cloned by someone prompting a coding agent, that's what you're looking at: some code that has been produced by a machine that gets the gist[^2] of what you say. The code is functional but in reality not yet useful, because it is only partially grappling with the general rules, and not at all with edge cases. That's as far as gist can take you.

To move beyond 'gist', GitHub have published an [open source toolkit for spec-driven development](https://github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai-get-started-with-a-new-open-source-toolkit/):
> ## Where we're headed
We’re moving from “code is the source of truth” to “intent is the source of truth.” With AI the specification becomes the source of truth and determines what gets built. 

Grand, but the emphasis on intent is not quite right in my view. Intent can be better or worse defined. If you are going to define your intent well - really well - you are writing a formal specification. A written specification that allows you to precisely define your intent may as well be code. There is no getting around writing detailed formal specifications for formal systems, if those sytems are going to have contact with the real world. And if you're writing a formal specification, you are doing formal reasoning.

Let's connect this to skills loss. A commonly-voiced anxiety about LLM-assisted coding is that developers will forget how to write code. This is probably true, but it's not worrisome. A precise, formal spec interpreted by an LLM is just another level of abstraction. As developers have begun working with higher-level languages, they've forgotten things about how lower levels of the stack work. This is a normal part of technological development. And supposing the developers do need to work in lower levels of the stack in future; they will learn how to do so in much the same way as they do today - including, by using LLMs.

[^1]: Let's take a moment to acknowledge that although in this context, I'm presenting this negatively, it's still miraculous.