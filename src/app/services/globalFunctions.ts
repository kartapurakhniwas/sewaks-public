import { DatePipe } from "@angular/common";
import { ValueGetterParams } from "ag-grid-community";
// import * as moment from "moment";

// export function dateFormat(data: any) {

//   let h = moment(data);
//   if (h.isValid()) {
//     return moment(data).format("MM/DD/YYYY");
//   }
//   else {
//     return "--"
//   }

// }

// export function dateFormatAG(data: any) {
//   console.log(data.data.journalDate, "dateeeeee");

//   return moment(data.data.journalDate).format("MM/DD/YYYY");


// }
// export function dateTimeFormat(data: any) {
//   //    console.log(data,'date');

//   return moment(data).format("MM/DD/YYYY, hh:mm A");
// }
// export function dateFormatInvoice(data: any) {
//   return moment(data).format("MM/DD/YYYY");
// }
// export function UTC_To_PST_dateTimeFormat(data: any) {
//   //    console.log(data,'date');

//   return moment(data).add(-8, 'hours').format("MM/DD/YYYY HH:mm");
// }

export function missingCodeFormatter(params: ValueGetterParams) {
  let data = params.data;
  if (data.missingCodeList != null && data.missingCodeList.length > 0) {
    let res = "";
    data.missingCodeList.forEach((item: any, index: any) => {
      res +=
        (item.doNumber ? item.doNumber + ": " : "") +
        "[" +
        item.missingCode.map((x: string) => (x += ",")) +
        "]";
    });
    return res;
  }
  return "--"
}

export function statusFormat(params: any) {


  switch (params.data?.status) {
    case 1:
      return "Active";
    case 2:
      return "InActive";

    default:
      return "--"
  }

}

export function unitType(params: any) {


  switch (params.data?.unitTye) {
    case 1:
      return "Box";
    case 2:
      return "Pallet";

    default:
      return "--"
  }

}

export function invoiceStatusFormat(params: any) {


  switch (params.data?.status) {
    case -1:
      return "Deleted";
    case 1:
      return "Draft";
    case 2:
      return "Posted";
    case 3:
      return "Partial Payment";
    case 4:
      return "Paid";
      case 5:
        return "Created";
        case 6:
          return "Hold";
          case 7:
            return "Revised";
      
    default:
      return "--"
  }

}

export function NotesStatus(params: any) {


  switch (params.data?.status) {
    
    case 1:
      return "Created";
    case 2:
      return "Posted";
    case 3:
      return "Revised";
    default:
      return "--"
  }

}

export function paymentStatusFormat(params: any) {
  console.log(params, "PaidPaidPaidPaidPaidPaidPaidPaid");
  
  // console.log(params);

  // if (params == -1) {
  //   return "Delete";
  // }
  // if (params == 1) {
  //   return "Draft";
  // }
  // if (params == 2) {
  //   return "Paid";
  // }

  // return "--"

  switch (params.data?.status) {
    case -1:
      return "Delete";
    case 1:
      return "Draft";
    case 2:
      return "Paid";
    
    default:
      return "--"
  }

}


export function journalStatusFormat(params: any) {


  switch (params.data?.status) {
    case 1:
      return "Created";
    case 2:
      return "Draft";
    case 3:
      return "Approved";
    case 4:
      return "Posted";
    case 5:
      return "Un Posted";
    case 6:
      return "Cancel";
    case 7:
      return "Avoid";

    default:
      return "--"
  }

}
export function paymentModeFormat(params: any) {
  switch (params.data?.status) {
    case 1:
      return "Cash";
    case 2:
      return "Credit Card";
    case 3:
      return "Cheque";
    case 4:
      return "EFT";
    case 5:
      return "E-Transfer";

    default:
      return "--"
  }

}

export function paymentMode(params: any) {


  switch (params.data?.status) {
    case 1:
      return "Cash";
    case 2:
      return "Cheque";
    case 3:
      return "Net Banking";

    default:
      return "--"
  }

}

export function statusAccountingFormat(params: any) {


  switch (params.data?.status) {
    case 1:
      return "Open";
    case 0:
      return "Close";

    default:
      return "--"
  }

}

export function QuickPickStatusFormat(params: any) {
  switch (params.data?.status) {
    case 1:
      return "New";
    case 2:
      return "OrderPicking";
    case 3:
      return "OrderPicked";
    case 4:
      return "Completed";
    default:
      return "--"
  }
}

export function inboundStatusFormat(params: any) {
  if (params.data?.Status == 1) {
    return "New";
  }
  if (params.data?.Status == 2) {
    return "Booked";
  }
  if (params.data?.Status == 3) {
    return "InYard";
  }
  if (params.data?.Status == 4) {
    return "Empty";
  }
  if (params.data?.Status == 5) {
    return "In Progress";
  }
  if (params.data?.Status == 6) {
    return "ScanComplete";
  }
  if (params.data?.Status == 7) {
    return "Complete";
  }
  if (params.data?.Status == 8) {
    return "GRN Created";
  }
  return "--"
}

export function vendordetail(parms: any) {
  var val = JSON.parse(parms.data.VendorDetail);
  if (val == undefined) {
    return "";
  } else {
    if (val.VendorName == val.Address) {
      return "";
    } else {
      return val.Address + " " + val.City + "," + val.State + " " + val.Postal;
    }
  }
}

export function custdetail(parms: any) {
  var val = JSON.parse(parms.data.customerDetail);
  if (val == undefined) {
    return "";
  } else {
    if (val.CustomerName == val.Address) {
      return "";
    } else {
      return val.Address + " " + val.City + "," + val.State + " " + val.Postal;
    }
  }
}

export function ShipperData(parms: any) {
  if (parms.data.VendorDetail != null && parms.data.VendorDetail != "") {
    var val = JSON.parse(parms.data.VendorDetail);

    if (val == undefined) {
      return "";
    } else {
      return val.VendorName; //val.Address +" "+ val.City +","+ val.State +" " + val.Postal;
    }
  } else {
    return "";
  }
}

export function CosgineeData(parms: any) {
  if (parms.data.CustomerDetail != null && parms.data.CustomerDetail != "") {
    var val = JSON.parse(parms.data.CustomerDetail);
    if (val == undefined) {
      return "";
    } else {
      return val.CustomerName; //val.Address +" "+ val.City +","+ val.State +" " + val.Postal;
    }
  } else {
    return "";
  }
}

export function roleFormat(params: any) {
  // params = JSON.parse(params);
  // return params[0];
  // params.filter((m) => {
  //     console.log(m[0] ,"params1");
  //         // return m[0] + ',' + m[1];
  //         // for (let i=0; m.length < i; i++) {
  //         //     return m[i] + ',';
  //         //     console.log(m[i] ,"params");
  //         // }
  //     });
  //     // // alert('sd');
  // // return 1;
}

export function relationType(params: any) {
  if (params.data?.type == 1) {
    return "Cust / Consig";
  }
  if (params.data?.type == 2) {
    return "Vendor / Supplier";
  }
  if (params.data?.type == 3) {
    return "Carrier"; // Should delete this
  }
  if (params.data?.type == 4) {
    return "Both(Cust and Vendor)";
  }
  return "--"
}

export function packingType(params: any) {
  if (params.data?.packingtype == 1) {
    return "Loose";
  } else if (params.data?.packingtype == 2) {
    return "Box";
  } else if (params.data?.packingtype == 3) {
    return "Ream";
  } else if (params.data?.packingtype == 4) {
    return "Pallet";
  } else if (params.data?.packingtype == 5) {
    return "Skid";
  } else if (params.data?.packingtype == 0) {
    return "";
  }

  if (params == 1) {
    return "Loose";
  } else if (params == 2) {
    return "Box";
  } else if (params == 3) {
    return "Ream";
  } else if (params == 4) {
    return "Pallet";
  } else if (params == 5) {
    return "Skid";
  } else if (params == 6) {
    return "PrePack";
  } else if (params == 7) {
    return "Individual Sizes";
  } else if (params == 0) {
    return "";
  }
  return "--"
}

export function packingTypeById(params: any) {
  if (params.data?.PackingTypeId == 1) {
    return "Loose";
  } else if (params.data?.PackingTypeId == 2) {
    return "Box";
  } else if (params.data?.PackingTypeId == 3) {
    return "Ream";
  } else if (params.data?.PackingTypeId == 4) {
    return "Pallet";
  } else if (params.data?.PackingTypeId == 5) {
    return "Skid";
  } else if (params.data?.PackingTypeId == 6) {
    return "PrePack";
  } else if (params.data?.PackingTypeId == 7) {
    return "Individual Sizes";
  } else if (params.data?.PackingTypeId == 0) {
    return "";
  }
  return "--"
}

export function productStatus(params: any) {
  if (params.data?.status == 1) {
    return "Active";
  }
  if (params.data?.status == 2) {
    return "Inactive";
  }
  if (params.data?.status == 3) {
    return "Hold";
  }
  if (params.data?.status == 4) {
    return "Quarantine";
  }

  if (params.status == 1) {
    return "Active";
  }
  if (params.status == 2) {
    return "Inactive";
  }
  if (params.status == 3) {
    return "Hold";
  }
  if (params.status == 4) {
    return "Quarantine";
  }
  return "--"
}

export function toBase64(eve: any) {
  let fil: any = '--';
  const file = eve.target.files[0];
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => {
    console.log(reader.result);
  };
}
