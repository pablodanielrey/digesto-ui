import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreloadTotalComponent } from './preload-total.component';

describe('PreloadTotalComponent', () => {
  let component: PreloadTotalComponent;
  let fixture: ComponentFixture<PreloadTotalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreloadTotalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreloadTotalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
