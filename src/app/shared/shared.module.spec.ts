import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TestBed } from '@angular/core/testing';
import { SharedModule } from './shared.module';

describe('SharedModule', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
    });
  });

  it('should import CommonModule', () => {
    const sharedModule = TestBed.inject(CommonModule);
    expect(sharedModule).toBeDefined();
  });

  it('should import FormsModule', () => {
    const sharedModule = TestBed.inject(FormsModule);
    expect(sharedModule).toBeDefined();
  });
});
