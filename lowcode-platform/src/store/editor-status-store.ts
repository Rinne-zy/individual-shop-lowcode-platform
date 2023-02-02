import { defineStore } from "pinia";

import { useSchemaStore } from 'lowcode-platform/store/schema-store';
import { AuxiliaryLineType, getAdsorptionLinePosStyle, getHorizontalLineConditions, getVerticalLineConditions } from 'lowcode-platform/utils/line';
import { getComponentRotatedStyle } from 'lowcode-platform/utils/rotate';

/** 辅助线 */
interface AuxiliaryLine {
  isShow: boolean,
  style: {
    top?: string,
    left?: string,
  },
}

/** 编辑器状态 store */
interface EditorStatusStore {
  // 选中的组件 schema id
  selectedComponentSchemaId: string;
  // 被选中的组件的 index
  selectedComponentIndex: number;
  // 是否展示菜单
  isShowMenu: boolean;
  // 菜单位置
  menuPosition: {
    left?: string,
    top?: string,
  };
  // 是否正在移动组件
  isMovingComponent: boolean;
  // 辅助线状态
  lineStatus: Record<AuxiliaryLineType, AuxiliaryLine>;
}

// 编辑区状态
export const useEditorStatusStore = defineStore('editorStatus', {
  state: (): EditorStatusStore => ({
    selectedComponentSchemaId: '',
    selectedComponentIndex: -1,
    isShowMenu: false,
    menuPosition: {},
    isMovingComponent: false,
    lineStatus: {
      xt: {
        isShow: false,
        style: {},
      },
      xc: {
        isShow: false,
        style: {},
      },
      xb: {
        isShow: false,
        style: {},
      },
      yl: {
        isShow: false,
        style: {},
      },
      yc: {
        isShow: false,
        style: {},
      },
      yr: {
        isShow: false,
        style: {},
      },
    },
  }),
  actions: {
    /**
     * 显示菜单
     * @param left 距离左侧定位
     * @param top 距离顶部定位
     */
    showMenu(left: string, top: string) {
      this.isShowMenu = true;
      this.menuPosition.left = left;
      this.menuPosition.top = top;
    },
    /** 重置 Store 状态 */
    resetStoreState() {
      this.selectedComponentIndex = -1;
      this.selectedComponentSchemaId = '';
      this.isShowMenu = false;
      this.menuPosition = {};
    },
    /** 隐藏辅助线 */
    hideLine() {
      Object.keys(this.lineStatus).forEach(line => {
        this.lineStatus[(line as AuxiliaryLineType)].isShow = false;
        this.lineStatus[(line as AuxiliaryLineType)].style = {};
      })
    },
    /**
     * 展示辅助线
     * @param isDownward 向下移动
     * @param isRightward 向右移动
     */
    showLine(isDownward: boolean, isRightward: boolean) {
      const schemaStore = useSchemaStore();
      const { components } = schemaStore.schema;
      const curComponent = components[this.selectedComponentIndex];
      // 当前选中组件的信息
      const curComponentStyle = getComponentRotatedStyle(curComponent.style);

      // 先消除线，否则会一直显示
      this.hideLine();
      components.forEach(component => {
        if(component.id === this.selectedComponentSchemaId) return;
        const componentStyle = getComponentRotatedStyle(component.style);
        // 辅助线状态
        const conditions = {
          vertical: getVerticalLineConditions(curComponentStyle, componentStyle),
          horizontal: getHorizontalLineConditions(curComponentStyle, componentStyle),
        };

        const needToShow = {} as Record<AuxiliaryLineType, boolean>;

        // 判断并展示符合条件的辅助线
        (Object.keys(conditions) as (keyof typeof conditions)[]).forEach((key) => {
          conditions[key].forEach((condition) => {
            if(!condition.isNearly) return;
            const pos = key === 'vertical' ? 'left' : 'top';

            // 吸附
            schemaStore.updatedComponentSchemaStyleById(
              this.selectedComponentSchemaId, 
              getAdsorptionLinePosStyle(pos, condition.adsorptionPos, curComponent.style, curComponentStyle),
            );

            // 更新辅助线样式
            this.lineStatus.yc.style
            this.lineStatus[condition.line].style[pos] = `${condition.linePos}px`;
            needToShow[condition.line] = true;
            if(Object.keys(needToShow).length) {
              // 同方向的辅助线只展示一条
              this.chooseLineAccordingToMoveDir(needToShow, isDownward, isRightward);
            }
          })
        });
      })
    },
    /**
     * 根据移动方向选择需要显示的辅助线
     * @param needToShow 需要展示的辅助线
     * @param isDownward 向下移动
     * @param isRightward 向右移动
     */
    chooseLineAccordingToMoveDir(
      needToShow: Record<AuxiliaryLineType, boolean>, 
      isDownward: boolean,
      isRightward: boolean,
    ) {
      // 向右移动
      if (isRightward) {
        // 从右到左
        if (needToShow.yr) {
          this.lineStatus.yr.isShow = true;
        } else if (needToShow.yc) {
          this.lineStatus.yc.isShow = true;
        } else if (needToShow.yl) {
          this.lineStatus.yl.isShow = true;
        }
      } else {
        // 从左到右
        if (needToShow.yl) {
          this.lineStatus.yl.isShow = true;
        } else if (needToShow.yc) {
          this.lineStatus.yc.isShow = true;
        } else if (needToShow.yr) {
          this.lineStatus.yr.isShow = true;
        }
      }

      // 向下移动
      if (isDownward) {
        // 从下到上
        if (needToShow.xb) {
          this.lineStatus.xb.isShow = true;
        } else if (needToShow.xc) {
          this.lineStatus.xc.isShow = true;
        } else if (needToShow.xt) {
          this.lineStatus.xt.isShow = true;
        }
      } else {
        // 从上到下
        if (needToShow.xt) {
          this.lineStatus.xt.isShow = true;
        } else if (needToShow.xc) {
          this.lineStatus.xc.isShow = true;
        } else if (needToShow.xb) {
          this.lineStatus.xb.isShow = true;
        }
      }
    }
  }
  
})