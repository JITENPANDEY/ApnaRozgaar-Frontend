import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app/services/app/app.service';
import { MatDialog } from '@angular/material/dialog';
import { CompanyService } from 'src/app/services/company/company/company.service';
import { Subscription } from 'rxjs';
import { SpinnerService } from 'src/app/services/spinner/spinner.service';
import swal from 'sweetalert2';
import { F } from '@angular/cdk/keycodes';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { TranslateService } from '@ngx-translate/core';



const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'app-company-job-applicants',
  templateUrl: './company-job-applicants.component.html',
  styleUrls: ['./company-job-applicants.component.scss']
})


export class CompanyJobApplicantsComponent implements OnInit {
  //pagination
  currentPage = 1;

  appService: AppService;
  spinnerService: SpinnerService;
  companyService: CompanyService;
  login: boolean;

  allApplicants=[];
  hiring=true
  jobId;

  subscription: Subscription;
  constructor(
    private router: Router,
    appService: AppService,
    spinnerService: SpinnerService,
    public dialog: MatDialog,
    companyService: CompanyService,
    private activatedRoute: ActivatedRoute,
    public translate: TranslateService
  ) {
    this.appService = appService;
    this.companyService = companyService;
    this.spinnerService = spinnerService;
  }


  ngOnInit(): void {

    let token = window.localStorage['loginTokenID'];
    let role = window.localStorage['role'];
    if (token == undefined) {
      this.router.navigate(['/']);
      return;
    } else {
      this.login = true;
      this.appService.login = true;
    }

    this.jobId = parseInt(this.activatedRoute.snapshot.paramMap.get('id'));
    this.companyService.fetchAllApplicants(this.jobId);

    this.subscription = this.companyService.companyDetailsUpdated.subscribe(
      () => {
        this.allApplicants = this.companyService.getAllApplicants();
        if(this.allApplicants.length){
          if(this.allApplicants[0].jobPost.closehirinig=='Yes'){
            this.hiring=false;
          }else{
            this.hiring=true;
          }
        }else{
          this.hiring=false;
        }
      }
    );
  }

  onUpdate(applicant){
    let oldapplicant = {
        ...applicant
    };
    this.companyService.updateAllApplicants(oldapplicant);
  }

  closeJob(): void {
    swal
      .fire({
        title: 'Do You want to close further Openings for this Job?',
        text: 'This will Reject left-over Applicants',
        showCancelButton: true,
        confirmButtonColor: '#4BB543',
        cancelButtonColor: '#d33',
        confirmButtonText: 'YES',
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.companyService.closeJob(this.jobId);
        }
      });
  }

  onCompanyLogout(){
    window.localStorage.clear();
    this.appService.login = false;
    this.appService.role = '';
    this.login = false;
    this.router.navigate(['/']);
  }


  downloadFile(): void {
    let applicantFormat=[];
    for(let i=0;i<this.allApplicants.length;i++){
      let newApplicant={
        'S.no':'',
        'Name':'',
        'Phone Number':'',
        'Date of Birth':'',
        'Gender':'',
        'AdharNumber':'AdharNumber',
        'Email':'Email',
        'Status':''
      }
      newApplicant['S.no']=(i+1).toString();
      newApplicant['Name']=this.allApplicants[i].seekerSignup.name;
      newApplicant['Phone Number']=this.allApplicants[i].seekerSignup.phonenumber;
      newApplicant['Date of Birth']=this.allApplicants[i].seekerSignup.dob.substr(0,10);
      newApplicant['Gender']=this.allApplicants[i].seekerSignup.gender;
      newApplicant['AdharNumber']=this.allApplicants[i].seekerSignup.adharNumber;
      newApplicant['Email']=this.allApplicants[i].seekerSignup.email;
      newApplicant['Status']=this.allApplicants[i].applicationstatus
      applicantFormat.push(newApplicant);
    }

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(applicantFormat);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'Applicants');
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

}
