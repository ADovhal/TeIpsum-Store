package com.teipsum.adminproductservice.util;

import com.teipsum.shared.product.enums.Gender;
import com.teipsum.shared.product.enums.ProductCategory;
import com.teipsum.shared.product.enums.ProductSubcategory;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Random;

@Component
public class SkuGenerator {

    private static final Random RANDOM = new Random();

    public String generateSku(ProductCategory category,
                              ProductSubcategory subcategory,
                              Gender gender) {
        StringBuilder sku = new StringBuilder();

        sku.append(getCategoryPrefix(category));

        if (subcategory != null) {
            sku.append(getSubcategoryPrefix(subcategory));
        } else {
            sku.append("00");
        }

        if (gender != null) {
            sku.append(getGenderPrefix(gender));
        } else {
            sku.append("U");
        }

        sku.append(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyMM")));
        sku.append(String.format("%04d", RANDOM.nextInt(10000)));

        return sku.toString();
    }

    private String getCategoryPrefix(ProductCategory category) {
        return switch (category) {
            case TOPS       -> "TP";
            case BOTTOMS    -> "BT";
            case DRESSES_SKIRTS -> "DS";
            case OUTERWEAR  -> "OW";
            case UNDERWEAR_SLEEPWEAR -> "UW";
            case ACTIVEWEAR -> "AW";
            case SWIMWEAR   -> "SW";
            case SHOES      -> "SH";
            case ACCESSORIES -> "AC";
            case BAGS       -> "BG";
            case JEWELRY    -> "JW";
            case KIDS       -> "KD";
            case BABY       -> "BB";
        };
    }

    private String getSubcategoryPrefix(ProductSubcategory subcategory) {
        return switch (subcategory) {
            case T_SHIRTS -> "TS";
            case SHIRTS -> "SH";
            case BLOUSES -> "BL";
            case TANK_TOPS -> "TT";
            case HOODIES -> "HD";
            case SWEATERS -> "SW";
            case CARDIGANS -> "CD";
            case CROP_TOPS -> "CT";
            case POLO_SHIRTS -> "PS";
            case JEANS -> "JN";
            case PANTS -> "PA";
            case SHORTS -> "ST";
            case LEGGINGS -> "LG";
            case JOGGERS -> "JG";
            case CHINOS -> "CH";
            case CARGO_PANTS -> "CP";
            case CASUAL_DRESSES -> "CD";
            case FORMAL_DRESSES -> "FD";
            case EVENING_DRESSES -> "ED";
            case MAXI_DRESSES -> "MD";
            case MINI_SKIRTS -> "MS";
            case MIDI_SKIRTS -> "MI";
            case MAXI_SKIRTS -> "MX";
            case COATS -> "CT";
            case JACKETS -> "JK";
            case BLAZERS -> "BZ";
            case VESTS -> "VS";
            case PARKAS -> "PK";
            case BOMBER_JACKETS -> "BJ";
            case LEATHER_JACKETS -> "LJ";
            case BRAS -> "BR";
            case PANTIES -> "PT";
            case BOXERS -> "BX";
            case BRIEFS -> "BF";
            case PAJAMAS -> "PJ";
            case NIGHTGOWNS -> "NG";
            case ROBES -> "RB";
            case LOUNGEWEAR -> "LW";
            case SPORTS_TOPS -> "ST";
            case SPORTS_BOTTOMS -> "SB";
            case TRACKSUITS -> "TR";
            case YOGA_WEAR -> "YW";
            case GYM_WEAR -> "GW";
            case RUNNING_GEAR -> "RG";
            case BIKINIS -> "BK";
            case ONE_PIECE -> "OP";
            case SWIM_TRUNKS -> "ST";
            case BOARD_SHORTS -> "BS";
            case COVER_UPS -> "CU";
            case SNEAKERS -> "SN";
            case BOOTS -> "BO";
            case SANDALS -> "SA";
            case HIGH_HEELS -> "HH";
            case FLATS -> "FL";
            case DRESS_SHOES -> "DS";
            case ATHLETIC_SHOES -> "AS";
            case LOAFERS -> "LF";
            case BELTS -> "BE";
            case HATS -> "HA";
            case CAPS -> "CA";
            case SCARVES -> "SC";
            case GLOVES -> "GL";
            case SUNGLASSES -> "SG";
            case WATCHES -> "WA";
            case TIES -> "TI";
            case HANDBAGS -> "HB";
            case BACKPACKS -> "BP";
            case TOTE_BAGS -> "TB";
            case CROSSBODY_BAGS -> "CB";
            case CLUTCHES -> "CL";
            case WALLETS -> "WL";
            case BRIEFCASES -> "BC";
            case NECKLACES -> "NK";
            case EARRINGS -> "ER";
            case BRACELETS -> "BR";
            case RINGS -> "RI";
            case BROOCHES -> "BO";
            case BOYS_TOPS -> "BT";
            case BOYS_BOTTOMS -> "BB";
            case BOYS_OUTERWEAR -> "BO";
            case GIRLS_TOPS -> "GT";
            case GIRLS_BOTTOMS -> "GB";
            case GIRLS_DRESSES -> "GD";
            case GIRLS_OUTERWEAR -> "GO";
            case KIDS_SHOES -> "KS";
            case KIDS_ACCESSORIES -> "KA";
            case BABY_BODYSUITS -> "BS";
            case BABY_SLEEPWEAR -> "SL";
            case BABY_OUTERWEAR -> "BO";
            case BABY_SHOES -> "BS";
            case BABY_ACCESSORIES -> "BA";
        };
    }

    private String getGenderPrefix(Gender gender) {
        return switch (gender) {
            case MEN -> "M";
            case WOMEN -> "W";
            case BOYS -> "B";
            case GIRLS -> "G";
            case BABY_BOY -> "BB";
            case BABY_GIRL -> "BG";
            case UNISEX -> "U";
        };
    }
}