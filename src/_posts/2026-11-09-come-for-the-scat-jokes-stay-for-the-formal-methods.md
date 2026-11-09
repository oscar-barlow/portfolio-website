---
layout: post
date: 2026-09-11
pull_quote: "It may yet be possible to rightsize the task of AI-assisted engineering to human cognitive capacity. Also, toilets, ha ha."
title: "Come for the scat jokes. Stay for the formal methods."
description: "It may yet be possible to rightsize the task of AI-assisted engineering to human cognitive capacity. Also, toilets, ha ha."
---
My friend [Ismael Celis](https://ismaelcelis.com/) wrote a great post recently: [Welcome to the machine](Welcome to the machine). He says that his post is only incidentally about AI. Mine unabashedly is.

Chatting about it led me to believe that [conceptual integrity](https://simonwillison.net/2026/Aug/19/conceptual-integrity-and-counting-lines-of-code/) in software development - or let's say, software product development, can actually mean two things:

1. The rules and state transitions that the system should allow, the business reasons, for them, and the weird edge cases where we found that we need to bend these rules a bit.
2. How the codebase represents (1); this is a fairly significant translation effort.

Prior to AI-assisted coding, those things went together so frequently in developers' heads that it could be difficult to distinguish them. I always felt a sense of shame, of being deficient as a developer because I'm not that great at (2). And I suspect that, due to the volume of code being produced in AI-assisted engineering, many developers today are feeling profoundly uneasy about (2); presented with a choice, they can either abandon (2), make a bet on the productivity gains and constantly-improving models, and hope for the best; or the can insist on (2) and drown in PR reviews. Neither choice is terribly appealing.

But I know what you're thinking. Where are the scat jokes? 

Behold:

![Toilet state transition chart]({{ "images/toilet-state-transition-chart.jpg" | relative_url }})

Ismael produced this for me in the course of our chat. A bespoke toilet-based state machine chart. Truly, this is one of the most profound honours I have ever received.

It's also fascinating in terms of where he is taking his thinking next[^1]. The most cool/important thing he's working on from my perspective is that he has a way to make these state charts not as separate from the code, nor requiring the code to be annotated. They are derived from production code itself[^2].

This allows us to take an important step: if we can _reliably_ hand over (2) to machines, we absolutely should! 

How might we be able to rely on this? I think the answer is formal verification, and this is what I'm currently exploring. Provided one can trust the derived state machine - and the mechanism for doing this should be something that we maintain a close familiarity with - we can use formal methods to test the state models produced and gain confidence in code produced partially, largely or wholly with AI assistance. It won't tell us whether the verification specs we write[^3] meet business needs. It also won't tell us whether our database calls are sane, our infra is over-provisioned, or our secrets have leaked. But it will tell us a lot - and it will enable us to _massively_ decrease the surface area of code we need deep familiarity with, in order to be able to confidently build and run our systems. We may yet be able to rightsize the work of AI-assisted engineering to human cognitive capacity.


This would totally reorient the practice of software development:
* Training junior developers - we're a bit stuck on this right now, aren't we? - becomes to a significant degree about training in verification methods.
* Reviewing work becomes reviewing proposed verifications, identifying whether the verification spec proposed actually expresses business needs, and how proposed verifications panned out in production[^4].
* Planning and scheduling work is similar.


[^1]: Not more scat jokes. Probably?
[^2]: Ismael notes that there's a lot of prior art in this space: [xstate](https://xstate.js.org/), [Harel, D. (1987). Statecharts: A visual formalism for complex systems. Science of computer programming, 8(3), 231-274.](https://www.state-machine.com/doc/Harel87.pdf), which he has been building on.
[^3]: And we should definitely write them ourselves. It would be so tempting to let LLMs do it. We should resist that temptation.
[^4]: I can't escape the thought that a prod deploy as a discrete event isn't the right abstraction for software engineering today, and that extending canary deploys with a measure of expected errors per 1,000 requests is the way to go. Haven't worked it all out yet. 
