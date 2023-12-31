import {
  Component,
  OnInit
}                  from "@angular/core";
import { CTest }   from "src/base/test.class";
import { ITest }   from "src/base/test.interface";
import { getType } from "tst-reflect";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit
{
  title = "tst-reflect";
  foo: CTest = new CTest();

  t = getType<ITest>();
  t2 = getType<CTest>();
  t3 = getType(this.foo);

  ngOnInit()
  {
  }
}
