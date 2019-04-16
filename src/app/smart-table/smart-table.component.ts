import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-smart-table',
  templateUrl: './smart-table.component.html',
  styleUrls: ['./smart-table.component.css']
})
export class SmartTableComponent implements OnInit {

  @Input() data;
  public pageTitle: string = 'Movie List';
  public listFilter: string;
  public TableHead = [];
  public dataObj;
  public tempObj = [];
  public tObj;
  public toggleSort: boolean = false;      //  true = asc  && false = desc
  public show = false;
  public pageModel = {}
  public itemsPerPage: number;
  public currentPage: number;
  public filterText: string;
  public showSearchBar: boolean = false;
  public headerStatus: boolean = true;
  public headers: any;
  public maxPages: number;
  public selectedCount: number = 2;
  public pages: any[] = [];
  public pagesToShow: number = 2;
  public count: number = 0;
  public tempPage: number;
  public j:number
  constructor() { }

  ngOnInit() {
      this.dataObj = {...this.data};
      this.initalize(2, 1, this.data)
      this.tempPage = this.pagesToShow
      this.createPages();
      this.show = true;
      this.pageChanged(this.pageModel);
  }

  public initalize(itemCount?: number, currentPage?: number, data?: any) {
    this.TableHead = data.colHeading;
    this.headers = data.colHeading;
    this.dataObj.colHeading = data.colHeading;
    this.dataObj['itemsPerPage'] = itemCount;
    this.dataObj['maxPage'] = Math.ceil(this.dataObj.Data.length / itemCount);
    this.dataObj['currentPage'] = currentPage;
    this.currentPage = currentPage;
    this.pageModel['page'] = currentPage;
    this.pageModel['itemsPerPage'] = itemCount;
    this.maxPages = this.dataObj['maxPage']
    this.tObj = {...this.dataObj};
    // this.createPages();
  }

  public pageChanged(pageModel, temp?) {
    this.tempObj = []
    if (temp == undefined) {
      temp = this.dataObj
      this.initalize(pageModel['itemsPerPage'], pageModel['page'], temp)
      for (let i = pageModel['itemsPerPage'] * (pageModel['page'] - 1); i < pageModel['itemsPerPage'] * (pageModel['page']); i++) {
        if (temp.Data[i])
          this.tempObj.push(temp.Data[i])
      }
      this.tObj.Data = this.tempObj
    }
    else {
      for (let i = pageModel['itemsPerPage'] * (pageModel['page'] - 1); i < pageModel['itemsPerPage'] * (pageModel['page']); i++) {
        if (temp[i])
          this.tempObj.push(temp[i])
      }
      this.tObj.Data = this.tempObj;
    }
    temp = {}
  }

  public sortData(value: string) {
    this.toggleSort = !this.toggleSort;
    let sortHeader = value;
    let temp: Array<any> = this.dataObj.Data;
    temp.sort((a, b) => {
      let str1: string = a[sortHeader].toLowerCase();
      let str2: string = b[sortHeader].toLowerCase();
      if (this.toggleSort) {
        if (str1 < str2) {
          return -1;
        }
        if (str1 > str2) {
          return 1;
        }
      }
      else {
        if (str1 > str2) {
          return -1;
        }
        if (str1 < str2) {
          return 1;
        }
      }
      return 0;
    })
    this.tempObj = temp
    this.tObj.Data = temp
    this.pageChanged(this.pageModel, temp)
  }


  public display() {
    this.showSearchBar = !this.showSearchBar
  }

  public searchText() {
    this.listFilter = this.filterText
  }

  public dropDown(e) {
    e.stopPropagation();
  }

  public toggleEditable(event, index) {
    let status = event.target.checked
    this.headers[index].display = status;
    this.tObj.colHeading[index].display = status;
  }


  setPage(page: number, perPage: number) {
    this.pageModel['page'] = page;
    this.pageModel['itemsPerPage'] = perPage;
    this.pageChanged(this.pageModel)
  }

  public createPages(temp?) {
    this.pages = [];
    console.log("called")
    // for (let i = 1; i <= this.maxPages; i++) {
    //   this.pages.push(i);
    // }
    if(this.count==0){
      for (let i = 1; i <= this.pagesToShow; i++) {
        if(i<=this.maxPages){
          this.pages.push(i);
          this.count++;
          console.log(this.count)
        }
        else{
          break;
        }
      }  
    }
    else{
      for (let i =this.count+1; i <= temp; i++) {
        if(i<=this.maxPages){
          this.pages.push(i);
          this.count++;
          console.log(this.count)
        }
        else{
          break;
        }
        
      }
    }
    console.log(this.pages)
  }

  public itemsNumber() {
    this.itemsPerPage = this.selectedCount;
    this.setPage(1, this.itemsPerPage)
  }

  public filter() {
    let items = this.dataObj.Data
    let filter = {}
    for(let i=0;i<this.tObj.headers.length;i++)
      filter[`${this.tObj.headers[i]}`] =  this.listFilter
    if (!filter){
      this.tObj.Data = items
    }
    if (!Array.isArray(items)){
      this.tObj.Data = items;
    }
    if (filter && Array.isArray(items)) {
      let filterKeys = Object.keys(filter);
      if (false) {
      //   return items.filter(item =>
      //       filterKeys.reduce((x, keyName) =>
      //           (x && new RegExp(filter[keyName], 'gi').test(item[keyName])) || filter[keyName] == "", true));
      }
      else {
        this.tObj.Data = items.filter(item => {
          return filterKeys.some((keyName) => {
            return new RegExp(filter[keyName], 'gi').test(item[keyName]) || filter[keyName] == "";
          });
        });
        this.pageChanged(this.pageModel, this.tObj.Data)
      }
    }
  } 

  public setPageNumber() {
    this.tempPage = this.tempPage + this.pagesToShow;
    this.createPages(this.tempPage)
  }

  public setRevPageNumber() {
    this.tempPage = this.tempPage - this.pagesToShow;
    this.createRevPages(this.tempPage)
  }

  public createRevPages(temp?) {
    this.pages = []
    console.log(this.count)
    console.log(temp)
    for(let i=this.count-1;i>temp;i--) {
      if(i>=this.pagesToShow){
        this.pages.unshift(i);
        this.count--;
        console.log(this.count)
      }
      else{
        console.log("else")
        for(let i=this.pagesToShow-1; i>=1;i--){
          console.log(i)
          this.pages.unshift(i)
        }
        break;
      }
      console.log(this.count)
    }
  }

}
