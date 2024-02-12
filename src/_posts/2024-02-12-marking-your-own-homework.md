---
layout: post
title: "Marking your own homework"
date: 2024-02-12
---
Podcasts and newsletters have started doing pieces where they check the accuracy of their predictions[^1]. This seems to be influenced by Tetlock and Gardner's critique in Superforecasting[^2] that pundits don't make predictions that are clearly true or false, and that they never hold themselves accountable. Well, they started.

There is plenty of scope to include this practice in engineering leadership, particularly in relation to system design. A few possibilities to review are described below.

## Production incidents
Such reviews normally look forwards, asking what work to schedule/process to change to avoid problems recurring. 

Given data about past production incidents are available[^3], you can ask more retrospective questions about your work in relation to a system you own, like:
- What assumptions did I make that have or haven't borne out?
- What features does this system share with others I've designed?
- What have I learned about running this system recently?
- ...
 
## RAID logs
Use a [RAID log](https://project-management.com/raid-log-project-management/) to get information to ask much the same questions as above. This information may not be as useful as incident reviews, because as noted on the page linked above: 

> A RAID log is only as current as the updates it receive. If it is outdated, then the information it provides will not be reliable. If you spend too much time updating your RAID log, you may miss out on other important responsibilities.

Nonetheless, RAID logs provide a time stamped record of thinking, and include perspectives from outside engineering. If it's there, it can be exploited.

## Movers and leavers 
Only possible in teams of a certain size. What emerges from considering all personnel changes together? What assumptions about recruitment and retention are proven right or wrong?

## Sprint retrospectives
A scrum retrospective seems like a good place to do this, but it is not. In a scrum retrospective:

> The Scrum Team inspects how the last Sprint went with regards to individuals, interactions, processes, tools, and their Definition of Done. Inspected elements often vary with the domain of work. Assumptions that led them astray are identified and their origins explored. The Scrum Team discusses what went well during the Sprint, what problems it encountered, and how those problems were (or were not) solved[^4].

This is too granular and near-focused to do the kind of reflection discussed in this post, although it may be a useful input. 

[^1]: See Freedman, S. (20 December 2023). The Audit: 2023. *Comment is Freed*. https://samf.substack.com/p/the-audit-2023 and Roose, K. & Newton, C. (22 December 2023). Our 2024 Predictions, and Jenny Slate Answers Your Hard Questions. *The New York Times*. https://www.nytimes.com/2023/12/22/podcasts/hard-fork-predictions-jenny-slate.html
[^2]: Tetlock, P. E., & Gardner, D. (2016). Superforecasting: The art and science of prediction. Random House. Sorry, no page number, read it ages ago and on Kindle.
[^3]: Not always a given, alas.
[^4]: Scrum.org. (n.d.). What is a Sprint Retrospective? Retrieved February 12, 2024, from https://www.scrum.org/resources/what-is-a-sprint-retrospective