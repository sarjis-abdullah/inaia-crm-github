export function useUserDetails(user) {
  function getChanneluser(type) {
    const channel =
      user.channels &&
      user.channels.length &&
      user.channels.find((c) => c.type.value == type);
    if (channel) {
      return channel.value;
    }
    return null;
  }

  return {
    get getName() {
      return (
        user.name + (user.person_data ? " " + user.person_data.surname : "")
      );
    },
    get avatar() {
      if (user && user.avatar) return user.avatar;
      else if (user && user.person_data) {
        let gender = user.person_data.gender
          ? user.person_data.gender.toLowerCase()
          : "";
        if (gender == "female" || gender == "f") {
          return "/img/theme/avatar_f.png";
        }
      }
      return "/img/theme/avatar_m.png";
    },
    get firstName() {
      return (user && user.name) || "";
    },
    get surName() {
      return (user && user.person_data && user.person_data.surname) || "";
    },
    get getAddress() {
      let text = "";
      if (user.address) {
        if (user.address.line1) {
          text += user.address.line1 + "\n";
        }
        if (user.address.line2) {
          text += user.address.line2;
        }
        text +=
          (user.address.postal_code ? "<br>" + user.address.postal_code : "") +
          (user.address.city ? " " + user.address.city : "") +
          (user.address.region ? "<br>" + user.address.region : "") +
          (user.address.country
            ? "<br>" + user.address.country.name_translation_key
            : "");
      }
      return text;
    },
    get age() {
      const birthDate = new Date(
        (user && user.person_data && user.person_data.birthdate) || null
      );
      today = new Date();
      age = today.getFullYear() - birthDate.getFullYear();
      monthDiff = today.getMonth() - birthDate.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }
      return age;
    },
    get getCountryName() {
      if (user && user.address && user.address.country) {
        return user.address.country.name_translation_key;
      } else {
        return "";
      }
    },
    get nationality() {
      return user.person_data && user.person_data.nationality_details
        ? user.person_data.nationality_details.nationality_translation_key
        : "";
    },
    get email(){
      return getChanneluser('email')
    },
    get mobile(){
      return getChanneluser('mobile')
    },
  };
}
