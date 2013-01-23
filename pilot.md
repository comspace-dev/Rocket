# Pilot

Pilot ist eine Sammlung von Mixins die übergebene Werte sowohl in <code>px</code> (als Fallback für ältere Browser) als auch in <code>rem</code> ausgeben.

## Constants

	$base-font-size-px: 16 !default;
	$base-spacing-px: 24 !default;
	$base-font-size: $base-font-size-px / 10;
	$base-spacing: $base-spacing-px / 10;

Sowohl <code>$base-font-size-px</code> als auch <code>$base-spacing-px</code> können in den projektspezifischen Styles überschrieben werden. Sie entsprechen der Schriftgröße für den Fließtext und der dazugehörigen Zeilenhöhe.
<code>$base-font-size</code> und <code>$base-spacing</code> sind für die Umrechnung von <code>px</code> in <code>rem</code> nötig.

## Functions

### stripZero

	@function stripZero($value) {
		@if $value == "0px" or $value == "0rem" {
			@return 0;
		}
		@else {
			@return $value;
		}
	}

Entfernt die Einheit (<code>px</code> und <code>rem</code>) wenn der Wert 0 ist.

## Mixins

### font-size

	@mixin font-size($size: $base-font-size-px, $height: 1) {
		font-size: stripZero($size + px);
		font-size: stripZero($size / 10 + rem);
		line-height: round($base-spacing * $height / $size * 10 * 100) / 100;
	}

Es wird eine Schriftgröße übergeben und die ensprechende Zeilenhöhe auf Basis von <code>$base-spacing-px</code> errechnet. Optional wird ein Vielfaches der Zeilenhöhe übergeben. So wird sicher gestellt, dass die Schriftgröße nicht größer ist als die Zeilenhöhe. Ausgegeben wird sowohl die Schriftgröße als auch die Zeilenhöhe.
Wird kein Wert übergeben kommen <code>$base-font-size-px</code> und <code>$base-spacing-px</code> zum Einsatz.

### shorthand

	@mixin shorthand($property, $value1, $value2: false, $value3: false, $value4: false) {
		@if $value4 and ($value1 != 0 or $value2 != 0 or $value3 != 0 or $value4 != 0) {
			#{$property}: stripZero($value1 + px) stripZero($value2 + px) stripZero($value3 + px) stripZero($value4 + px);
			#{$property}: stripZero($value1 / 10 + rem) stripZero($value2 / 10 + rem) stripZero($value3 / 10 + rem) stripZero($value4 / 10 + rem);
		}
		@else if $value3 and ($value1 != 0 or $value2 != 0 or $value3 != 0) {
			#{$property}: stripZero($value1 + px) stripZero($value2 + px) stripZero($value3 + px);
			#{$property}: stripZero($value1 / 10 + rem) stripZero($value2 / 10 + rem) stripZero($value3 / 10 + rem);
		}
		@else if $value2 and ($value1 != 0 or $value2 != 0) {
			#{$property}: stripZero($value1 + px) stripZero($value2 + px);
			#{$property}: stripZero($value1 / 10 + rem) stripZero($value2 / 10 + rem);
		}
		@else if $value1 and $value1 != 0 {
			#{$property}: stripZero($value1 + px);
			#{$property}: stripZero($value1 / 10 + rem);
		}
	}

Dem Mixin müssen neben einer Eigenschaft bis zu vier Werte übergeben werden. Es eignet sich so für Eigenschaften wie <code>margin</code>, <code>padding</code> oder <code>border-radius</code>.

### leading

	@mixin leading($value: $base-spacing-px, $property: margin, $side: top) {
		#{$property}-#{$side}: stripZero($value + px);
		#{$property}-#{$side}: stripZero($value / 10 + rem);
	}

Ohne zusätzliche Werte erzeugt das Mixin einen Abstand nach oben (<code>margin</code>) mit dem Wert von <code>$base-spacing-px</code>. Alternativ kann ein eigener Wert, eine andere Eigenschaft wie <code>padding</code> und eine Richtung wie etwa <code>left</code> übergeben werden.

### border

	@mixin border($value: 1, $style: solid, $side: false) {
		@if not $side {
			border: {
				width: stripZero($value + px);
				width: stripZero($value / 10 + rem);
				style: $style;
			}
		}
		@else {
			border-#{$side}: {
				width: stripZero($value + px);
				width: stripZero($value / 10 + rem);
				style: $style;
			}
		}
	}

Werden keine Werte übergeben erzeugt das Mixin eine <code>border</code> von <code>1px</code> mit <code>border-style: solid;</code>. Optional kann eine andere Breite, ein anderer Stil und eine Seite übergeben werden.

### box-shadow

	@mixin box-shadow($h-off: 2, $v-off: 2, $blur: 4, $spread: 0, $color: rgba(0,0,0,0.5), $inset: false) {
		@if $inset {
			box-shadow: stripZero($h-off + px) stripZero($v-off + px) stripZero($blur + px) stripZero($spread + px) $color inset;
			box-shadow: stripZero($h-off / 10 + rem) stripZero($v-off / 10 + rem) stripZero($blur / 10 + rem) stripZero($spread / 10 + rem) $color inset;
		}
		@else {
			box-shadow: stripZero($h-off + px) stripZero($v-off + px) stripZero($blur + px) stripZero($spread + px $color);
			box-shadow: stripZero($h-off / 10 + rem) stripZero($v-off / 10 + rem) stripZero($blur / 10 + rem) stripZero($spread / 10 + rem) $color;
		}
	}

Das Mixin akzeptiert alle nötigen Werte für einen <code>box-shadow</code>. Ohne übergebene Werte wird ein Schatten mit einem Abstand von jeweils <code>2px</code>, einem Schein von <code>4px</code>, keinem Abstand mit 50 % schwarz erzeugt. Wird als letzter Wert <code>inset</code> übergeben kippt der Schatten nach innen.

### position

	@mixin position($type, $coords) {
		$top: nth($coords, 1);
		$right: nth($coords, 2);
		$bottom: nth($coords, 3);
		$left: nth($coords, 4);

		position: $type;
		@if $top {
			@if $top == auto {
				top: $top;
			}
			@else {
				top: stripZero($top + px);
				top: stripZero($top / 10 + rem);
			}
		}
		@if $right {
			@if $right == auto {
				right: $right;
			}
			@else {
				right: stripZero($right + px);
				right: stripZero($right / 10 + rem);
			}
		}
		@if $bottom {
			@if $bottom == auto {
				bottom: $bottom;
			}
			@else {
				bottom: stripZero($bottom + px);
				bottom: stripZero($bottom / 10 + rem);
			}
		}
		@if $left {
			@if $left == auto {
				left: $left;
			}
			@else {
				left: stripZero($left + px);
				left: stripZero($left / 10 + rem);
			}
		}
	}

Es müssen sowohl der Typ als auch genau vier Werte für die Koordinaten übergeben werden. Die Koordinaten entsprechen den Positionen in der Reihenfolge <code>top, right, bottom, left</code> und können neben absoluten Werten auch <code>auto</code> oder <code>false</code> sein. Übergibt man für eine Position <code>false</code> so wird diese Position nicht ausgegeben.