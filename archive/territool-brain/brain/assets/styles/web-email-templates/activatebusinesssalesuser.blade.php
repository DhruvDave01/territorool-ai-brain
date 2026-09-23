@extends('mails.layout')
@section('body')
<tr>
	<td colspan="2">Dear Manager,</td>
</tr>

<tr>
	<td colspan="2" width="560px">{{ $demo->name }} activated their TerriTool account.</td>
</tr>
<tr>
	<td colspan="2" align="center">&nbsp;</td>
</tr>
<tr>
	<td colspan="2" style="background: #595959; color: #ffffff; padding: 10px; line-height: 20px;">Here are the user details:</td>
</tr>
<tr>
	<td style="color: #666666; padding: 10px; font-weight: bold; line-height: 20px;padding-bottom:0px">Name:</td>
	<td>{{ $demo->name }}</td>
</tr>
<tr>
	<td style="color: #666666; padding: 10px; font-weight: bold; line-height: 20px;padding-bottom:0px">Email:</td>
	<td>{{ $demo->email }}</td>
</tr>
<tr>
	<td style="color: #666666; padding: 10px; font-weight: bold; line-height: 20px;padding-bottom:0px">Phone:</td>
	<td>{{ $demo->phone }}</td>
</tr>

        	
</table>    
@endsection