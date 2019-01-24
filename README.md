# *microfe*
*(microfe - short for micro frontends)*

A naive infrastructure/metaframework implementation for micro frontends. This project intends to provide necessary tooling to achieve independent apps loaded separately and run on different parts on single web page in complete isolaton.
For detailed information on the topic can be found [micro-frontends.org](https://micro-frontends.org/)
## Motivation
When developing micro services there are lots of tools and libraries to help developers to focus the effort on the things needs to be done instead of fighting against monolithic monster. For now, "micro frontends" idea is still premature and it needs time to grow somethig easy to use. My intention is to contribute to this discussion and also provide necessary tooling and a sample architecture for developers who would like to give it a try. Providing an easy to use infrastructure for individuals and companies can be considered as ultimate goal.
## Who will/may/can use *microfe*?
Ideally *microfe* is not suitable for small teams and for them trying to use it would not be necessary. For this kind of teams refactoing their monolitich fe apps would be more productive instead of using *microfe* to devide a relatively big app into smaller piecies and trying to maintain each piece. If the project contains at least two independent team which are responsible from same monolithic app then *microfe* can be beneficial. Because *microfe* gives the opportunity of working on undependent tech stack by each team. It can provide isolation and managed communication channels between micro-apps.
## On Micro Frontends
While companies growing they usually move from one tem to two or more and they start to divide the code base and on the backend side micro service architechture has lots of benefits to scale the company up. On the frontend side the code base becomes a growing monolith even if it is written in a modular fashion. So scaling a front end team is not so easy and problems start to appear. Lack of comminucation between teams, conflicting merges, hard to change tech stacks, hard to update depnedencies and the list goes on.

Similar to micro services, the micro frontends provides the opportunity to isolate code bases and make the teams free to use any code standards and tech stack and focus on relatively small parts of the application.
## Goals
* Isolated apps
* Independent apps
* A way to have a unified UI
* inter app communication (i.e. authentication)
* Easy to maintain apps
* Not to break already available build environments for major frameworks (React, Angular, Vue)
* Reusable apps