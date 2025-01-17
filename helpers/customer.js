export function updateAddressAndGetObject(customer,{line1,line2,postal_code,city,region,country_id})
{
    let newAddress = {
        line1:line1,
        line2:line2,
        postal_code:postal_code,
        city:city,
        contact_id: customer.id,
        country_id:country_id?country_id:customer.address.country,
        type_id:customer.address.type_id,
        is_primary:true,
        is_active:true,
        id:customer.address.id,
    };
    
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
                nationality:{id:customer.person_data.nationality_details?customer.person_data.nationality_details.id:null}
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
export function updateSalesAdvisorAndGetObject(customer,sales_advisor_id)
{
    return {
        id: customer.id,
        customer: {
            contact: {
                id: customer.id,
                name: customer.name,
                type_id: customer.type.id,
                is_active: customer.is_active,
                sales_advisor_id:sales_advisor_id,
            },
            person_data: {
                ...customer.person_data,
                contact_id: customer.id,
                nationality:{id:customer.person_data.nationality_details?customer.person_data.nationality_details.id:null}
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
            channels: customer.channels
        }
    }

}
export function functionUpdateChannelAndGetObject(customer,channel,value){
    let newChannels = JSON.parse(JSON.stringify(customer.channels));
    let selectedChannel = newChannels.find(x=>x.type.value==channel);
    if(selectedChannel){
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
                    nationality:{id:customer.person_data.nationality_details?customer.person_data.nationality_details.id:null}
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
    else{
        return null;
    }
    
}
export function functionUpdateAccountAndGetObject(customer,account){
    return {
        id: customer.id,
        customer: {
            contact: {
                id: customer.id,
                name: customer.name,
                type_id: customer.type.id,
                is_active: account.is_active
            },
            person_data: {
                ...customer.person_data,
                contact_id: customer.id,
                nationality:{id:customer.person_data.nationality_details?customer.person_data.nationality_details.id:null}
            },
            address: {
                ...customer.address,
                contact_id: customer.id,
            },
            account: account,
            channels: customer.channels
        }
    }
}
export function functionUpdatePersonDataAndGetObject(customer,lastname,middleName,firstname,birthdate){
    return {
        id: customer.id,
        customer: {
            contact: {
                id: customer.id,
                name: firstname,
            },
            person_data: {
                id:customer.person_data.id,
                surname:lastname,
                middlename:middleName,
                birthdate:birthdate
            },
        }
    }
}
export function updateKycStatusAndGetObject(customer,kycStatus){
    return {
        id: customer.id,
        customer: {
            contact: {
                id: customer.id,
                kyc_status_id: kycStatus.id,
            }
        }
    }
}