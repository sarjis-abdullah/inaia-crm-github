export function updateAddressAndGetObject(customer,{line1,line2,postal_code,city,region})
{
    let newAddress = {
        line1:line1,
        postal_code:postal_code,
        city:city,
        contact_id: customer.id,
        country_id:customer.address.country_id,
        type_id:customer.address.type_id,
        is_primary:true,
        is_active:true,
        id:customer.address.id,
        country:customer.address.country
    };
    if(line2)
    {
        newAddress.line2 = line2;
    }
    if(region)
    {
        newAddress.region = region;
    }
    return {
        id: customer.id,
        customer: {
            contact: {
                id: customer.id,
                name: customer.name,
                type_id: customer.type.id,
                is_active: customer.is_active
            },
            person_data: {
                ...customer.person_data,
                contact_id: customer.id,
                nationality:customer.person_data.nationality?customer.person_data.nationality:[]
            },
            address: newAddress,
            account: {
                ...customer.account,
                contact_id: customer.id,
                // if customer has invalid account-type then ensure valid account-type
                type_id: customer.account && customer.account.type_id
                    ? customer.account.type_id
                    : 0
            },
            channels: customer.channels
        }
    }

}
export function functionUpdateChannelAndGetObject(customer,channel,value){
    let newChannels = JSON.parse(JSON.stringify(customer.channels));
    let selectedChannel = newChannels.find(x=>x.type.value==channel);
    selectedChannel.value = value;
    return {
        id: customer.id,
        customer: {
            contact: {
                id: customer.id,
                name: customer.name,
                type_id: customer.type.id,
                is_active: customer.is_active
            },
            person_data: {
                ...customer.person_data,
                contact_id: customer.id,
                nationality:customer.person_data.nationality?customer.person_data.nationality:[]
            },
            address: {
                ...customer.address,
                contact_id: customer.id,
            },
            account: {
                ...customer.account,
                contact_id: customer.id,
                // if customer has invalid account-type then ensure valid account-type
                type_id: customer.account && customer.account.type_id
                    ? customer.account.type_id
                    : 0
            },
            channels: newChannels
        }
    }
}