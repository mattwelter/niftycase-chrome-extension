
const toPromise = (callback) => {
  return new Promise((resolve, reject) => {
    try {
      callback(resolve, reject);
    } catch(err) {
      reject(err);
    }
  });
};

const ADDRESS_KEY = 'addresses';

class AddressStore {

  static getAddresses = () => {
    return toPromise((resolve,reject) => {
      chrome.storage.local.get([ADDRESS_KEY], (result) => {
        if (chrome.runtime.lastError)
          reject(chrome.runtime.lastError);
        const data = result.addresses ?? [];
        resolve(data);
      });
    });
  }

  static setAddress = async (name, addr) => {
    const addresses = await this.getAddresses();
    const created_at = new Date().getTime();
    // TODO: if addr null -> delAddress(name)
    // if (!addr) {
    //   return this.delAddress(name);
    // } else
    if (addresses.find(address => address.name === name)) {
      const updatedAddresses = [...addresses.map(address => {
        return address.name === name ? { name, addr, created_at } : address;
      })];
      return toPromise((resolve, reject) => {
        chrome.storage.local.set({ [ADDRESS_KEY]: updatedAddresses }, () => {
          if (chrome.runtime.lastError)
            reject(chrome.runtime.lastError);
          resolve(updatedAddresses);
        });
      });
    } else {
      const updatedAddresses = [...addresses, { name, addr, created_at }];
      return toPromise((resolve, reject) => {
        chrome.storage.local.set({ [ADDRESS_KEY]: updatedAddresses }, () => {
          if (chrome.runtime.lastError)
            reject(chrome.runtime.lastError);
          resolve(updatedAddresses);
        });
      });
    }
  }

  static getAddress = async (name) => {
    const addresses = await this.getAddresses();
    const address = addresses.filter(address => {
      return address.name === name;
    });
    return address[0] ?? null;
  }

  static delAddress = async (name) => {
    const addresses = await this.getAddresses();
    const updatedAddresses = [...addresses.filter(address => {
      return address.name !== name;
    })];
    return toPromise((resolve, reject) => {
      chrome.storage.local.set({ [ADDRESS_KEY]: updatedAddresses }, () => {
        if (chrome.runtime.lastError)
          reject(chrome.runtime.lastError);
        resolve(updatedAddresses);
      });
    });
  }

  static clearAddresses = () => {
    return toPromise((resolve, reject) => {
      chrome.storage.local.remove([ADDRESS_KEY], () => {
        if (chrome.runtime.lastError)
          reject(chrome.runtime.lastError);
        resolve();
      })
    });
  }

}
