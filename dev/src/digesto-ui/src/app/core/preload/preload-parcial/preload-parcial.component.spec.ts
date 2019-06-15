import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreloadParcialComponent } from './preload-parcial.component';

describe('PreloadParcialComponent', () => {
  let component: PreloadParcialComponent;
  let fixture: ComponentFixture<PreloadParcialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreloadParcialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreloadParcialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
