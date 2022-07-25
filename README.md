#rules

building blocks:

filter
content-decide
context-decide
split
aggregate

enrich
normalize

reduce
side-effect

- on (selectCountry) do (citiesRequestedByCountryId) = citiesRequested$

- on (citiesRequestedByCountryId) split into (citiesSuccess) or (citiesFailure) = citiesCompleted$
- on (citiesSuccess) do (selectCity(first)) = defaultCitySelected$
- on (selectCity) do (null for messageDetailsSuccess, clearMessageSelection, missionDetailsSuccess, clearMissionSelection) = allSelectionsCleared$

- on (selectCity) do (messagesRequestByCityId) = messagesRequested$
- on (messagesRequestByCityId) split into (messagesSuccess) or (messagesFailure) = messagesCompleted$
- on (ToggleMessage) with latest from (state.selectedMessages) content-decide:
  ...on 1 message selected => do (API.MessageDetailsRequest)
  ...else => do (messageDetailsSuccess(null))
  = afterToggleMessageMissionsDetailsUpdated$
- on (messageDetailsRequest) content-decide:
  ...on (cleardetails = true) split into (messageDetailsSuccess) or (messageDetailsFailure)
  ...else do (messageDetailsSuccess(null))
  = messageDetailsCompleted$

- on (selectCity) do (missionsRequestedByCityId) = missionsRequested$
- on (missionsRequestedByCityId) split into (missionSuccess) or (missionFailure) = missionsCompleted$
- on (selectCity) do (MissionDetailsClear) = missionDetailsCleared$
- on (ToggleMission) with latest from (state.selectedMissions) content-decide:
  ...on 1 mission selected => do (API.MissionDetailsRequest)
  ...else => do (MissionDetailsClear)
  = afterToggleMissionMissionsDetailsUpdated$
- on (missionDetailsRequested) split into (missionDetailsSuccess) or (missionDetailsFailure) = missionDetailsCompleted$
