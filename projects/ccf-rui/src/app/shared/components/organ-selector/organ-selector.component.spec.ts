import { Shallow } from 'shallow-render';

import { OrganSelectorComponent } from './organ-selector.component';
import { OrganSelectorModule } from './organ-selector.module';
import { OrganInfo } from './organ-selector.component';

describe('OrganSelectorComponent', () => {
  let shallow: Shallow<OrganSelectorComponent>;
  const testOrganList = [
    {name: 'A', src: 'A', hasData: true},
    {name: 'B', src: 'B', hasData: true},
    {name: 'C', src: 'C', hasData: true},
    {name: 'D', src: 'D', hasData: true},
    {name: 'E', src: 'E', hasData: true},
    {name: 'F', src: 'F', hasData: true},
    {name: 'G', src: 'G', hasData: true},
  ] as OrganInfo[];

  beforeEach(() => {
    shallow = new Shallow(OrganSelectorComponent, OrganSelectorModule);
  });

  it('should shift the carousel left if dir === left.', async () => {
    const { find, instance } = await shallow.render();
    const carousel = find('.carousel-item-list').nativeElement as HTMLElement;
    carousel.style.left = '80px';
    instance.onLeft = false;
    instance.shift('left', 40);
    expect(carousel.style.left).toBe('120px');
  });

  it('should shift the carousel right if dir === right.', async () => {
    const { find, instance } = await shallow.render();
    const carousel = find('.carousel-item-list').nativeElement as HTMLElement;
    carousel.style.left = '80px';
    instance.onRight = false;
    instance.shift('right', 40);
    expect(carousel.style.left).toBe('40px');
  });

  it('should not shift the carousel right if carousel is already at right end.', async () => {
    const { find, instance } = await shallow.render();
    const carousel = find('.carousel-item-list').nativeElement as HTMLElement;
    instance.organList = testOrganList;
    carousel.style.left = '-80px';
    instance.onRight = true;
    instance.shift('right', 40);
    expect(carousel.style.left).toBe('-80px');
  });

  it('should not shift the carousel left if carousel is already at left end.', async () => {
    const { find, instance } = await shallow.render();
    const carousel = find('.carousel-item-list').nativeElement as HTMLElement;
    instance.organList = testOrganList;
    carousel.style.left = '0px';
    instance.onLeft = true;
    instance.shift('left', 40);
    expect(carousel.style.left).toBe('0px');
  });

  it('should emit the organ name whenever selectOrgan is called.', async () => {
    const { instance, outputs } = await shallow.render();
    const testOrgan: OrganInfo = {name: 'test', src: 'test', hasData: true};
    instance.selectOrgan(testOrgan);
    expect(outputs.organChanged.emit).toHaveBeenCalled();
  });

  it('should tell if an icon is selected.', async () => {
    const { instance } = await shallow.render();
    const testOrgan: OrganInfo = {name: 'test', src: 'test', hasData: true};
    const testOrgan2: OrganInfo = {name: 'test2', src: 'test2', hasData: true};
    instance.selectOrgan(testOrgan);
    expect(instance.isSelected(testOrgan)).toBeTrue();
    expect(instance.isSelected(testOrgan2)).toBeFalse();
  });

});
