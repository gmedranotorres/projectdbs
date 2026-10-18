# Seguimiento

A weekly check-in for a job search: it tells you who to follow up with.

## Who it's for

A second-year grad student applying to jobs in Chicago. They apply in bursts between classes, on a phone and a laptop, and lose track of who to follow up with. It's a weekly ritual, not a CRM.

## The main task

Log an application → it's on my list with a follow-up date → on Monday, Seguimiento tells me who to follow up with.

## The flows

The steps, states and errors behind this diagram are in [flows.md](flows.md).

```mermaid
flowchart TD
  subgraph first["First visit"]
    open(["Open Seguimiento"]) --> home["/"]
    home --> anything{"Anything saved?"}
    anything -- No --> empty["Ritual + example Monday"]
  end

  subgraph main["Main task"]
    add["/add"] --> valid{"Valid?"}
    valid -- "No: errors by field,<br/>typing kept" --> add
    valid -- Yes --> saved["Saved: follow-up date"]
    saved -- "Add another" --> add
    saved -- "See it in list" --> list["/applications"]
    list -- Update --> edit["/applications/edit?id=…"]
    edit -- "Save or I followed up" --> list
  end

  subgraph back["Coming back"]
    monday(["Monday"]) --> checkin["/ (check-in)"]
    checkin --> due{"Follow-ups due?"}
    due -- Yes --> act["I followed up · Not yet"]
    act -- "Undo or next one" --> checkin
    due -- No --> caught["All caught up: next date"]
    checkin -. "21+ days, no news" .-> quiet["Gone quiet:<br/>follow up · close"]
  end

  empty -- "Log your first application" --> add
  anything -- Yes --> checkin
  act -- Details --> edit
  caught -- "Log an application" --> add
```

## Onboarding research

_To fill in._

## First visit

_To fill in._

## Coming back

_To fill in._

## What it remembers

_To fill in._

## Accessibility

_To fill in._

## First-run check

_To fill in._

## Running locally

_To fill in._
