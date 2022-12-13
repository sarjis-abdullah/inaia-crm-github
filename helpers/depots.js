export function isSilverDepot(depot)
{
    return depot && depot.depot_type && depot.depot_type.name_translation_key == "Silver";
}
export function isGoldDepot(depot)
{
    return depot && depot.depot_type && depot.depot_type.name_translation_key == "Gold";
}