import type { MudletMap } from "mudlet-map-binary-reader";
import _ from "lodash";
import { MapChangeRule } from "../classes/Rule.ts";
import mapModel from "../helpers/MapModel.ts";

export function createDisallowLockedAreasRule(
  map: Pick<MudletMap, "areaNames" | "areas" | "rooms"> | null
) {
  if (map === null) {
    return new MapChangeRule(
      async () => true,
      "No map is available in the repository template."
    );
  }

  const areasWithAllRoomsLocked = _.chain(map.areas)
    .map((area, id) => ({ area, id }))
    .filter((obj) => obj.area.rooms.length > 0)
    .filter((obj) =>
      _.every(obj.area.rooms, (room) => map.rooms[room].isLocked)
    )
    .map((obj) => obj.id)
    .map((id) => map.areaNames[id])
    .value();

  return new MapChangeRule(
    async () => areasWithAllRoomsLocked.length === 0,
    areasWithAllRoomsLocked.length === 0
      ? "All areas unlocked."
      : `Found the following locked areas: ${areasWithAllRoomsLocked.toString()}`
  );
}

export const disallowLockedAreas = createDisallowLockedAreasRule(mapModel);
