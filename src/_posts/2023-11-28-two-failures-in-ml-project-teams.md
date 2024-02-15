---
layout: post
title: "Two failures in ML project teams"
date: 2023-11-28
---
There are 2 failures I've noticed in structuring teams in ML projects. I'm construing this context quite broadly here to include engineers who build and maintain systems in which ML models are trained and run, as well as the data scientists who build them[^1].

The first failure I call 'engineers as handmaids to data scientists,' which hopefully evokes the negative characteristics of this situation quite well. Namely, that in this setup, the systems are too complex, or data scientists lack the skills, to do anything in production independently[^2]. It's a frustrating waste of time for all concerned. Better use can be made of skilled engineers than turning a notebook into production code. In the case that a rewrite is necessary (e.g. from pandas to (py)spark), this process is error prone and frustrating. It also increases iteration cycle time.

The second, countervailing, failure is to expect data scientists to have broad enough skills to be comfortable across the entire stack. Not to need engineers at all, in other words. A cross-functional team is a great thing, but this is not mutually exclusive with specialisation, which is worthwhile. Having data scientists (e.g.) tuning subnet settings is probably a misallocation of time and effort. Not to mention, this broad a skillset is extremely difficult to hire for.

These two failures have been deliberately presented together as opposites. Navigating between the two is difficult. We can borrow the concept of the [tooth to tail ratio](https://en.m.wikipedia.org/wiki/Tooth-to-tail_ratio) to help us think about things. If data scientists are the 'teeth', then how many (application/data/infrastructure/ML) engineers as 'tail' are optimal to support them? One ML engineer per data scientists is surely terribly inefficient. Zero ML engineers per data scientist is unrealistic, and both are unlikely to scale well even if you can make them work in the first place.

A further implication of this way of thinking about things is that increasing ML output may be unrelated to what your data scientists are doing. If you're off your optimal ratio, or the mix which comprises the 'tail' has changed, you might need to fix that first.

[^1]: Reputedly, at Google, ML engineers take ownership of ML projects from inception to production. That's certainly another way of solving this problem, but remember that you're probably not Google.
[^2]: This shouldn't be taken as a criticism of collaboration, rather of architectures and processes, and team structures which create silos. The problems with this are well known from other types of software delivery.