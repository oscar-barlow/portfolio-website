---
layout: post
title: "Characteristic change in business processes from AI transformation"
date: 2025-05-01
---
Scott Werner notes in [The Coming Knowledge-Work Supply-Chain Crisis](https://worksonmymachine.substack.com/p/the-coming-knowledge-work-supply) that business processes for managing knowledge work ill-suited the amount of throughput it looks like we'll get from using AI:
> ... our tools aren’t designed for the volume of work AI can generate. In AI Programs While I Sleep, you can see that I am already underwater with hundreds of AI-generated PRs to review. Our code review tools are designed for reviewing at most 5-10 PRs a day, not 50. You can also see a similar pattern emerge in the other videos having to do with managing user stories, doing product acceptance, and test case validation. Our tools are designed for orders of magnitude less work.

Making 'orders of magnitude' more work happen is the productivity boost that many expect from AI. But as well as volume increasing, I think our outputs are about to get a lot more varied - our processes are going to get fuzzier.

Consider a process like employee onboarding. [CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete) operations against a relational database are a reasonable mental model for this kind of process. For each task in the employee onboarding flow, you can imagine a table in a database with its having its fields updated; `induction_training_completed_date`, `department_fk`, and so on. To be clear, I'm not arguing that every business maintains such a database, but rather that this is what business processes are _like_. This is how we think about getting things done. And this isn't surprising, given that software systems and business management practice evolved alongside each other during the latter half of the 20th century.

This kind of process promises a lot of regularity. Of course there's some variation - some employees take longer to complete the induction training, while others never complete it at all. Most employees get assigned to a department, but exceptionally some employees don't. Businesses (and database designers) expect this and know how to design their processes and software systems to manage this kind of variation.

Adding more volume to this kind of process certainly poses challenges as described in the blog quoted above, certainly. But now let's consider adding an AI tool in to our imaginary employee onboarding flow. In this case, someone has decided to create a [NotebookLM notebook](https://notebooklm.google/) to help employees onboard instead of putting them through induction training. Instead of watching training videos and answering quizzes, now new joiners chat with an AI, answering questions as they come up. Each person will ask different things and get different answers. At this point, it becomes a lot harder to know when the induction training has been completed. Actually, does the question even make sense any more?

You could still track when the notebook was assigned or first accessed, but that's not really what you're interested in. In the CRUD-esque world you had some reason to believe that all new joiners went through a regular process - you don't any more. The outcome of this particular process has become less tractable, less defined, and what the process consists of - what new joiners actually encounter - is a lot more varied too. This is a characteristic change in our processes, not just a volume change.

Of course, this kind of change won't be limited to induction training. It's just a useful example.
