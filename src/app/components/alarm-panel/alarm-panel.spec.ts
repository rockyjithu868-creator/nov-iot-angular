import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlarmPanel } from './alarm-panel';

describe('AlarmPanel', () => {
  let component: AlarmPanel;
  let fixture: ComponentFixture<AlarmPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlarmPanel],
    }).compileComponents();

    fixture = TestBed.createComponent(AlarmPanel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
