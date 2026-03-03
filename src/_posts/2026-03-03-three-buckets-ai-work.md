---
layout: post
title: "Henry Ford, paper stacks, and three buckets of AI work"
date: 2026-03-03
---
Ford's workers hated his assembly line[^1] and in their diairies expressed how unnatural it felt, and how they resented their deskilling. It took a lot of trial and error to arrive at the assembly line technique[^2]. Ford's continuous experiments with production techniques almost bankrupted him several times over[^3].

Comparisons between software engineering and manufacturing production are common enough[^4], so let's focus for a moment on the experience of the workers: how bizarre, and contrary to common sense and good practice the assembly line felt.

***

Now consider this on digital transformation - the quote is about government services but it's broadly applicable:
> Much of the economy has changed in the last 70 years or so, but broadly speaking, [public] service delivery looks a lot like service delivery did in, say, 1950. We had a paper-based workflow then, and the government is pretty good, relatively speaking, at architecting workflows where: we need a floor of clerks, we need a front office, the front office passes paper to the floor of clerks, they get 10,000 papers on Monday, we successfully drain that stack within six weeks, and everything is operating as designed.
And if you asked in 1950, "Give me a real-time count of how many papers are in process," they’d say: one, that’s a crazy thing to ask for, but two, if you want an approximation, go look at the physical floor and count how many inches of paper there are in the to-be-done box. That’s your count.
These days we have computer systems that are pretty good at doing real-time counts. **But because the institutional memory of the system is that tracking the progress of an in-flight application is just strictly beyond the bounds of what’s materially possible — and I can’t even ask a web app to look at how many inches of paper there are because the paper doesn’t exist anymore — I’ve actually lost fidelity by moving to the computer system.**
The management of these programs often doesn’t do things that are pretty table stakes for private industry, which came up in a post-computer age. Private industry writes SQL queries because it has business analysts. It’s not that the government has no business analysts, but I often think there is a crushing undersupply of them relative to need, and a management culture that doesn’t really make data-driven decisions — in a number of places, both in the management of the agencies and in the legislative branch[^5].

Emphasis mine.

Again I want to focus on the expereince people involved in this work - we're thinking about managers rather than labourers now. By adding computers to their business processes, they believe they have lost visibility and so control of those processes.

***

Here are three 'buckets' categorising where generative AI can be integrated into an organsition:

1. Personal productivity
2. In the loop in back-office processes, such that teams have an 'AI teammate'
3. Into customer-facing products or important internal systems by teams of engineers and data scientists

We're totally fine with 1 & 3. We know how to train people to use Deep Research, or wordsmith their emails with Gemini in GMail. Likewise, any organisation that has been shipping data science projects to production for any amount of time should not have difficulty shipping an AI project (and many of them have).

1 & 3 also don't need to challenge our production techniques. It is _possible_ to use AI to do your work pretty much like you used to but faster, and 1 & 3 are where we see that[^6].

We have no idea about 2. We have no idea what co-ordinating the work of groups of humans who are each collaborating with one or several peculiarly intelligent machines looks like. We can be pretty sure, however, that to the people doing it it's going to feel bizarre, contrary to common sense, and like a loss of visibility and control.

I suspect it will emerge out of 1, and we should amp that up as much as possible.


[^1]: [Eschner, K. (2016, December 1). In 1913, Henry Ford introduced the assembly line: His workers hated it. Smithsonian Magazine.](https://www.smithsonianmag.com/smart-news/one-hundred-and-three-years-ago-today-henry-ford-introduced-assembly-line-his-workers-hated-it-180961267/)
[^2]: [Weber, K. (2013, October 1). The Moving Assembly Line Turns 100](https://www.assemblymag.com/articles/91581-the-moving-assembly-line-turns-100)
[^3]: [Hounshell, D. A. (1984). From the American system to mass production, 1800-1932: The development of manufacturing technology in the United States (pp. 230–273). Johns Hopkins University Press.](https://www.google.co.uk/books/edition/From_the_American_System_to_Mass_Product/9H3tHKUFcfsC?hl=en)
[^4]: ICYMI: writing software is (was?) a creative pursuit so full of irregularities that it cannot be automated, but delivering software artifacts to a live environment - we even call it 'production' - sure as heck can be, and doing so propagates many beneficial changes back through the software delivery lifecycle.
[^5]: [McKenzie, P. (Host). (2026, February 26). Understanding government procurement, with Luke Farrell [Audio podcast episode]. In _Complex Systems_.](https://www.complexsystemspodcast.com/episodes/understanding-government-procurement-with-luke-farrell/)
[^6]: It's possible to work pretty much like you used to, but it seems likely that 3 will change profoundly in the near future. See: [Tane, B. (2026, February 20). The software development lifecycle is dead. Boris Tane.](https://boristane.com/blog/the-software-development-lifecycle-is-dead/)


