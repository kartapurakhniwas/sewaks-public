import * as XLSX from "xlsx";
import * as FileSaver from "file-saver";
import * as JSZip from "jszip";
import { MasterService } from "src/app/services";
import { Injectable } from "@angular/core";

const EXCEL_TYPE =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
const EDI_TYPE = 'application/octet-stream';
const EXCEL_EXTENSION = ".xlsx";
const EDI_EXTENSION = ".edi";

const ZIP_EXTENSION = ".zip";

const getFileName = (name: string, sheet: string = "") => {
  // let timeSpan = new Date().toISOString();
  let sheetName = sheet || name || "ExportResult";
  let fileName = `${ name || "ExportResult" }`;
  return {
    sheetName,
    fileName,
  };
};

export interface zipFile {
  data: Blob;
  fileName: string;
}

@Injectable()

export class TableUtil {



  constructor(private gl: MasterService){}

   importExcel (event: any) {
    const reader = new FileReader();
    reader.onload = (e:any) => {
      this.gl.xlsxData = null;
      const arrayBuffer = e.target.result;
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, {
        dateNF: 'YYYY-MM-DD',
        defval: (value:any) => typeof value === 'string' ? value.replace(/ /g, '_') : value
      });
      let sjsonData:any = jsonData;
      sjsonData.forEach( (obj:any) => {

        Object.keys(obj).forEach((key) => {
          var replacedKey = key.trim().replace('./', '_').replace(' ', '_').replace('Ref_No_Cheque No.', 'Ref_No_Chq_No');
          if (key !== replacedKey) { 
            obj[replacedKey] = obj[key];
             delete obj[key];
          }
       });
      } );
      console.log(sjsonData, "sjsonData");
      this.gl.xlsxData = sjsonData;
      // console.log(this.gl.xlsxData, "this.gl.xlsxData");
      
    };
    reader.readAsArrayBuffer(event.target.files[0]);
    
  }

  


  static exportTableToExcel(tableId: string, name?: any) {
    let { sheetName, fileName } = getFileName(name);
    let targetTableElm = document.getElementById(tableId);
    let wb = XLSX.utils.table_to_book(targetTableElm, <XLSX.Table2SheetOpts>{
      sheet: sheetName,
    });
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  }

  static exportArrayToExcel(arr: any[], name?: any) {
    let { sheetName, fileName } = getFileName(name);

    var wb = XLSX.utils.book_new();
    var ws = XLSX.utils.json_to_sheet(arr);
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  }

  static exportAgGridToExcel(arr: any[], name?: any,sheetNAme?:any) {
    let { sheetName, fileName } = getFileName(name,sheetNAme);

    var wb = XLSX.utils.book_new();
    var ws = XLSX.utils.json_to_sheet(arr);
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  }

  // static exportMultipleArrayToExcel(arr: any[], name?: string, proName?: any[]) {
  //    let { sheetName, fileName } = getFileName(name);
  //   var wb = XLSX.utils.book_new();
  //   var ws = XLSX.utils.json_to_sheet(arr[0]);
  //   console.log(proName, "proName");
  //   for (var i = 1; i < arr.length; i++) {
  //     XLSX.utils.sheet_add_json(ws, arr[i], {skipHeader: true, origin: -1});
  //   }
  //   XLSX.utils.book_append_sheet(wb, ws, sheetName);
  //   XLSX.writeFile(wb, `${fileName}.xlsx`);
  // }

  static exportMultipleArrayToExcel(
    arr: any[],
    name?: any,
    proName?: any,
    data?: any
  ): Set<zipFile> {
    let { sheetName, fileName } = getFileName(name);

    // var wb = {
    //   SheetNames: proName, // <-- include the sheet names in the array
    //   Sheets: {
    //     // Sheet1: { // <-- each sheet name is a key in the Sheets object
    //     //   "!ref":"A1:B2",
    //     //   A1: { t:"n", v:1 },
    //     //   B2: { t:"n", v:4 }
    //     // },
    //     // JS: { // <-- since "JS" is the second entry in SheetNames, it will be the second tab
    //     //   "!ref":"A1:B2",
    //     //   A2: { t:"s", v:"Sheet" },
    //     //   B1: { t:"s", v:"JS" }
    //     // }
    //   }
    // }

    var wb = XLSX.utils.book_new();

    var ws;
    console.log(data, "dataaaaa");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(data), "Summary");
    for (var i = 0; i < arr.length; i++) {
      //  XLSX.utils.sheet_add_json(wb, arr[i], {skipHeader: true, origin: -1});
      // let a = [
      //   "sd",
      //   "sd",
      //   "sd",
      // ]
      ws = XLSX.utils.json_to_sheet(arr[i]);

      XLSX.utils.book_append_sheet(wb, ws, proName[i]);
    }
    //  XLSX.utils.book_append_sheet(wb, ws);

    //  XLSX.writeFile(wb, `${fileName}.xlsx`);
    const excelBuffer: any = XLSX.write(wb, {
      bookType: "xlsx",
      type: "array",
    });

    let fileLst = this.SaveAsExcelFile(excelBuffer, `${fileName}.xlsx`);
    return fileLst;
  }

  static fileLst: zipFile[] = [];
  static ediFileLst: zipFile[] = [];

  static SaveAsExcelFile(buffer: any, fileName: string) {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    if (this.fileLst.filter((x) => x.fileName === fileName).length === 0) {
      this.fileLst.push({
        data: data,
        fileName: fileName,
      });
    }
    let fileLstSet = new Set(this.fileLst);

    return fileLstSet;

  }

  static SaveAsEDIFile(buffer: any, fileName: string, Lst: zipFile[], isLast: boolean = false) {
    const data: Blob = new Blob([buffer], { type: EDI_TYPE });
    // FileSaver.saveAs(data, fileName); 

    if (Lst.filter((x) => x.fileName === fileName).length === 0) {
      Lst.push({
        data: data,
        fileName: fileName,
      });
    }
    if (isLast)
      return new Set(Lst);

    return Lst;


  }

  static DownloadZipFile(fileLstSet: Set<zipFile>, zipFileName: string = '') {
    const jszip = new JSZip();

    for (const file of fileLstSet) {
      jszip.file(file.fileName, file.data);
    }

    jszip.generateAsync({ type: "blob" }).then(function (content) {
      if (zipFileName)
        FileSaver.saveAs(content, zipFileName + "_" + new Date().toLocaleDateString().replace('/', '_') + '_' + new Date().toLocaleTimeString('en-GB') + ZIP_EXTENSION);
      else
        FileSaver.saveAs(content, new Date().toLocaleDateString().replace('/', '_') + ZIP_EXTENSION);
    });
  }
}
